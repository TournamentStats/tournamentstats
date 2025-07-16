import type { openAPISchema } from '@types'

export const docs: openAPISchema = {
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
}
