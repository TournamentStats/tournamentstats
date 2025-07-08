import * as z from 'zod/v4'

import { and, eq, sql } from 'drizzle-orm'

const pathParams = z.object({
	tournamentId: z.string().min(1),
})

const requestBody = z.object({
	name: z.string().min(3).max(32),
	shorthand: z.string().min(1).max(5).optional(),
	imageId: z.string().optional(),
})

/**
 * POST /api/tournaments/[tournamentId]/teams
 *
 * Creates a team in the tournament
 *
 * ReturnBody: team
 */
export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = event.context.auth.user!
		const { tournamentId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
		const { name, shorthand, imageId } = await readValidatedBody(event, obj => requestBody.parse(obj))

		const createdTeam = await db.transaction(async (tx) => {
			const insertedTeamCTE = tx.$with('inserted_team').as(
				tx.insert(team)
					.select(
						tx.select({
							tournamentId: tournament.tournamentId,
							name: sql<string>`${name}`.as('name'),
							shorthand: sql<string | null>`${shorthand ?? null}`.as('shorthand'),
						})
							.from(tournament)
							.where(
								and(
									eq(tournament.shortId, tournamentId),
									hasTournamentModifyPermissions(user),
								),
							),
					)
					.returning(),
			)
			const createdTeam = await tx.with(insertedTeamCTE)
				.select({
					teamId: insertedTeamCTE.shortId,
					tournamentId: tournament.shortId,
					name: insertedTeamCTE.name,
					shorthand: insertedTeamCTE.shorthand,
				})
				.from(insertedTeamCTE)
				.innerJoin(tournament, eq(insertedTeamCTE.tournamentId, tournament.tournamentId))
				.then(maybeSingle)

			if (!createdTeam) {
				throw createNotFoundError('Tournament')
			}

			let imageUrl = null
			if (imageId) {
				imageUrl = (await moveTeamImage(event, imageId, createdTeam.tournamentId, createdTeam.teamId)).signedUrl
			}

			return {
				...createdTeam,
				imageUrl,
			}
		})

		return createdTeam
	}),
})
