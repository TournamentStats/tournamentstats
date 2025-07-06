import * as z from 'zod/v4'

import { and, eq, sql } from 'drizzle-orm'

const pathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
})

const puuid = z.string().length(78)

const player = z.object({
	puuid: puuid,
	name: z.string().min(2).max(24).optional(),
})

const requestBody = z.object({
	add: z.array(player).optional(),
	remove: z.array(puuid).optional(),
}).refine(data => data.add?.length ?? data.remove?.length, {
	message: 'At least one of \'add\' or \'remove\' must be provided and non-empty',
	path: ['add', 'remove'],
})

defineRouteMeta({
	openAPI: {
		tags: ['tournament'],
		description: 'Add or remove players to a team.',
		requestBody: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						anyOf: [
							{
								type: 'object',
								properties: {
									add: {
										type: 'array',
										items: {
											type: 'object',
											required: ['puuid'],
											properties: {
												puuid: {
													type: 'string',
													description: 'PUUID of the League of Legends Player to add to the tournament',
												},
												name: {
													type: 'string',
													description: 'Custom display name for the player',
												},
											},
										},
									},
								},
							},
							{
								type: 'object',
								properties: {
									remove: {
										type: 'array',
										items: {
											type: 'string',
										},
									},
								},
							},
						],
					},
					examples: {
						'add-players': {
							summary: 'Adding players to a team',
							value: {
								add: [
									{
										puuid: 'Zz2sEt4n_mfS37AyXSqXnNw4eXDHHRfsYXD2FQb7jOLIrttOjtIe88cu_fKqwkPVgCSc_4slSNSrbg',
										name: 'T1 Faker',
									},
									{
										puuid: '-_39jej0AK9hmOi7qlTJNUMMX9F1V4_iDXXxiGH21co6RxS1zMXjJphnSkLAaRejfFYm2NUhc2b3zg',
										name: 'T1 Gumayusi',
									},
								],
							},
						},
						'remove-players': {
							summary: 'Removing players from a team',
							value: {
								remove: [
									'Zz2sEt4n_mfS37AyXSqXnNw4eXDHHRfsYXD2FQb7jOLIrttOjtIe88cu_fKqwkPVgCSc_4slSNSrbg',
								],
							},
						},
					},

				},
			},
			required: true,
		},
		security: [{ authentication: [] }],
	},
})

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
		const added = []
		const removed = []

		await db.transaction(async (tx) => {
			const fks = await tx.select({
				tournamentId: tournament.tournamentId,
				teamId: team.teamId,
			})
				.from(team)
				.innerJoin(tournament, eq(team.tournamentId, tournament.tournamentId))
				.where(
					and(
						eq(tournament.shortId, tournamentId),
						eq(team.shortId, teamId),
						hasTournamentModifyPermissions(user),
					),
				)
				.then(maybeSingle)

			if (!fks) {
				throw createNotFoundError('Team', 'in the specified tournament.')
			}

			if (add && add.length > 0) {
				const insertedPlayerCTE = tx.$with('inserted_player').as(
					tx.insert(tournamentParticipant)
						.values({
							tournamentId: sql.placeholder('tournamentId'),
							teamId: sql.placeholder('teamId'),
							puuid: sql.placeholder('puuid'),
							name: sql.placeholder('name'),
						})
						.returning(),
				)

				const prepared = db.with(insertedPlayerCTE)
					.select({
						teamId: team.shortId,
						tournamentId: tournament.shortId,
						puuid: insertedPlayerCTE.puuid,
						name: insertedPlayerCTE.name,
					})
					.from(insertedPlayerCTE)
					.innerJoin(tournament, eq(insertedPlayerCTE.tournamentId, tournament.tournamentId))
					.innerJoin(team, eq(insertedPlayerCTE.teamId, team.teamId))
					.prepare('insert_player')

				await Promise.all(add.map(async (player) => {
					const insertedPlayer = await prepared.execute({
						...player,
						tournamentId: fks.tournamentId,
						teamId: fks.teamId,
					})
						.then(single)
					added.push(insertedPlayer)
				}))
			}

			if (remove && remove.length > 0) {

			}
		})
	},
})
