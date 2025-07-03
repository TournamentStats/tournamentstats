import { and, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

const pathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
})

const requestBody = z.object({
	name: z.string().min(3).max(32),
	shorthand: z.string().min(1).max(5).optional(),
	imageId: z.string().optional(),
})

/**
 * PATCH /api/tournaments/[tournamentId]/teams/[teamId]
 *
 * Patches a team in the tournament
 *
 * ReturnBody: team
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user!
		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => pathParams.parse(obj))
		const { name, shorthand, imageId } = await readValidatedBody(event, obj => requestBody.parse(obj))

		const updatedTeam = await db.transaction(async (tx) => {
			const { shortId, createdAt, ...rest } = getTableColumns(team)
			let updatedTeam
			try {
				updatedTeam = await tx.update(team)
					.set({ name, shorthand })
					.from(tournament)
					.where(
						and(
							eq(team.tournamentId, tournament.tournamentId),
							eq(tournament.shortId, tournamentId),
							eq(team.shortId, teamId),
							hasTournamentModifyPermissions(user),
						),
					)
					.returning({
						...rest,
						teamId: team.shortId,
						tournamentId: tournament.shortId,
					})
					.then(maybeSingle)
			}
			catch (e: unknown) {
				if (e instanceof Error) {
					event.context.errors.push(e)
				}
				throw createGenericError()
			}

			if (!updatedTeam) {
				throw createNotFoundError('Team')
			}

			let imageUrl = null
			if (imageId) {
				imageUrl = (await moveTeamImage(event, imageId, tournamentId, teamId)).signedUrl
			}

			return {
				imageUrl,
				...updatedTeam,
			}
		})

		return updatedTeam
	},
})
