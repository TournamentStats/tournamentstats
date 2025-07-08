import * as z from 'zod/v4'

import { and, eq, or, inArray, sql } from 'drizzle-orm'

const PathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
})

const Puuid = z.string().length(78, 'No valid puuid')

const Player = z.object({
	puuid: Puuid,
	name: z.string().min(2).max(24).optional(),
})

const RequestBody = z.object({
	add: z.array(Player).optional(),
	remove: z.array(Puuid).optional(),
}).refine(data => data.add?.length ?? data.remove?.length, {
	message: 'At least one of \'add\' or \'remove\' must be provided and non-empty',
	path: ['add', 'remove'],
})

defineRouteMeta({
	openAPI: {
		$global: {
			components: {
				responses: {
					ValidationError: {
						description: 'Validation Error',
						summary: 'Error during validation',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									allOf: [
										{	$ref: '#/components/schemas/ErrorModel' },
										{
											type: 'object',
											properties: {
												statusCode: {
													type: 'number',
													const: 400,
												},
												statusMessage: {
													type: 'number',
													const: 'Validation Error',
												},
												error: {
													type: 'object',
													properties: {
														message: {
															type: 'string',
														},
														data: {
															type: 'object',
															description: 'Contains all validation errors in a `[parameter]: errorArray`-style map',
															additionalProperties: {
																type: 'array',
																description: 'Parameter that couldn\'t be validated',
																items: {
																	type: 'string',
																	description: 'Human readable error message',
																},
															},
														},
													},
												},
											},
										},
									],
								},
								example: {
									statusCode: 400,
									statusMessage: 'Validation Error',
									error: {
										message: 'Error during validation',
										data: {
											puuid: [
												'Not a valid PUUID',
											],
										},
									},
								},
							},
						},
					},
					401: {
						description: 'Missing Authorization',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									allOf: [
										{	$ref: '#/components/schemas/ErrorModel' },
										{
											type: 'object',
											properties: {
												statusCode: {
													type: 'number',
													const: 401,
												},
												statusMessage: {
													type: 'number',
													const: 'Unauthorized',
												},
												error: {
													type: 'object',
													properties: {
														message: {
															type: 'string',
														},
													},
												},
											},
										},
									],
								},
								example: {
									statusCode: 401,
									statusMessage: 'Unauthorized',
									error: {
										message: 'Couldn\'t retrieve your session. Make sure you are logged in and cookies are enabled.',
									},
								},
							},
						},
					},
				},
				schemas: {
					ErrorModel: {
						type: 'object',
						properties: {
							statusCode: {
								type: 'number',
								description: 'The HTTP response status code',
								externalDocs: {
									url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status',
								},
							},
							statusMessage: {
								type: 'string',
								description: 'The message of the response status',
							},
						},
					},
					PUUID: {
						type: 'string',
						description: 'PUUID of player.',
						format: 'PUUID',
						externalDocs: {
							description: 'PUUIDs are managed by Riot Games',
							url: 'https://developer.riotgames.com/docs/lol#summoner-names-to-riot-ids_obtaining-puuid-and-summonerid-from-riotid',
						},
					},
					Player: {
						type: 'object',
						required: ['puuid'],
						properties: {
							puuid: {
								$ref: '#/components/schemas/PUUID',
							},
							name: {
								type: 'string',
								description: 'The custom display name of the player',
							},
							gameName: {
								type: 'string',
								description: 'The in-game name of the player\'s account',
							},
							gameTag: {
								type: 'string',
								description: 'The in-game tag of the player\'s account',
							},
						},
					},
				},
			},
		},
		tags: ['tournament'],
		summary: 'Update Team Roster',
		description: 'Either add players to or remove players from a existing team. Eventually fetches the player if it not exists ',
		requestBody: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						anyOf: [
							{
								type: 'object',
								title: 'Add Players',
								properties: {
									add: {
										type: 'array',
										minItems: 1,
										items: {
											type: 'object',
											required: ['puuid'],
											description: 'Players to add to the team',
											properties: {
												puuid: {
													$ref: '#/components/schemas/PUUID',
													description: 'PUUID of the League of Legends player to add to the team',
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
								title: 'Remove Players',
								properties: {
									remove: {
										type: 'array',
										minItems: 1,
										description: 'Players to remove from the team',
										items: {
											$ref: '#/components/schemas/PUUID',
										},
									},
								},
							},
						],
					},
					examples: {
						'add-players': {
							summary: 'Adding players to a team.',
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
		responses: {
			200: {
				description: 'Sucessful',
				summary: 'All players were sucessfully added to team or removed from the team.',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								added: {
									type: 'array',
									description: 'Players added to the team',
									items: {
										$ref: '#/components/schemas/Player',
									},
								},
								removed: {
									type: 'array',
									description: 'Players removed from the team',
									items: {
										$ref: '#/components/schemas/Player',
									},
								},
							},
						},
						example: {
							added: [
								{
									puuid: 'Zz2sEt4n_mfS37AyXSqXnNw4eXDHHRfsYXD2FQb7jOLIrttOjtIe88cu_fKqwkPVgCSc_4slSNSrbg',
									name: 'T1 Faker',
									gameName: 'Hide on Bush',
									gameTag: 'KR1',
								},
								{
									puuid: '-_39jej0AK9hmOi7qlTJNUMMX9F1V4_iDXXxiGH21co6RxS1zMXjJphnSkLAaRejfFYm2NUhc2b3zg',
									name: 'T1 Gumayusi',
									gameName: 'T1 Gumayusi',
									gameTag: 'KR1',
								},
							],
							removed: [
								{
									puuid: 'E_11ihAQLGrIdPY_gYav8rIcWeQOymLYZN2x4NdQvvM7nHKNGcn85quvFwXcwrlPC3zcjoVagYG-Tg',
									name: 'T1 Smash',
									gameName: 'T1 Smash',
									gameTag: 'KR3',
								},
							],
						},
					},
				},
			},
			400: {
				$ref: '#/components/responses/ValidationError',
			},
			401: {
				$ref: '#/components/responses/401',
			},
			404: {
				description: 'Not Found',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							allOf: [
								{ $ref: '#/components/schemas/ErrorModel' },
								{
									type: 'object',
									properties: {
										statusCode: {
											type: 'number',
											const: 404,
										},
										statusMessage: {
											type: 'string',
											const: 'Not Found',
										},
										error: {
											type: 'object',
											properties: {
												message: {
													type: 'string',
													description: 'Message specific to the error that occured',
												},
												puuid: {
													$ref: '#/components/schemas/PUUID',
													description: 'PUUID of the player not found, if applicable',
												},
											},
										},
									},
								},
							],
						},
						examples: {
							'Team not Found': {
								description: 'Team not found',
								value: {
									statusCode: 404,
									statusMessage: 'Not Found',
									error: {
										message: 'Team not found',
									},
								},
							},
							'Player not Found': {
								description: 'Player not found',
								value: {
									statusCode: 404,
									statusMessage: 'Not Found',
									error: {
										message: 'There is no player associated with that PUUID',
										puuid: 'E_11ihAQLGrIdPY_gYav8rIcWeQOymLYZN2x4NdQvvM7nHKNGcn85quvFwXcwrlPC3zcjoVagYG-Tg',
									},
								},
							},
						},
					},
				},
			},
		},
		security: [{ authentication: [] }],
	},
})

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = event.context.auth.user!

		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj))
		const { add, remove } = await readValidatedBody(event, data => RequestBody.parse(data))

		const puuids = [...(add?.map(p => p.puuid) ?? []), ...(remove ?? [])]

		// check if there a puuids not in our system
		const s = db.select()
			.from(sql`unnest(${puuids}) puuid`)
			.leftJoin(player, eq(player.puuid, sql`puuid`))

		console.log(s.getSQL())

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
	}),
})
