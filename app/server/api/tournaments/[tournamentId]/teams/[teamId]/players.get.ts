import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

const pathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
})

const puuid = z.string().length(78)

const player = z.object({
	puuid: puuid,
	name: z.string().min(2).max(24),
})

const requestBody = z.object({
	add: z.array(player),
	remove: z.array(puuid),
})

/**
 * GET /api/tournaments/[tournamentId]/teams/[teamId]/players
 *
 * Gets all members of the team
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
		const { add, remove } = await readValidatedBody(event, data => requestBody.parse(data))

		await db.transaction(async (tx) => {
			if (add.length > 0) {
				await tx.insert(tournamentParticipant)
					.select(
						tx.select({
							puuid: sql<string>`EXCLUDED.puuid`.as('puuid'),
							tournamentId: sql<number>`EXCLUDED.tournament_id`.as('tournamentId'),
							name: sql<string>`EXCLUDED.name`.as('name'),
							teamId: sql<number | null>`EXCLUDED.team_id`.as('teamId'),
						})
							.from(tournamentParticipant)
							.where(
								and(
									eq(tournamentParticipant.tournamentId, tournamentId),
									eq(tournamentParticipant.teamId, teamId),
								),
							)
					.onConflictDoUpdate({
						target: [
							tournamentParticipant.puuid,
							tournamentParticipant.tournamentId,
							tournamentParticipant.name,
							tournamentParticipant.teamId,
						],
						set: {
							name: sql`EXCLUDED.name`
						}
					})
			}

			if (remove.length > 0) {
				await tx.delete(teamPlayer)
					.where(
						and(
							eq(teamPlayer.tournamentId, tournamentId),
							eq(teamPlayer.teamId, teamId),
							eq(teamPlayer.puuid, remove),
						),
					)
			}
		}
	},
})
