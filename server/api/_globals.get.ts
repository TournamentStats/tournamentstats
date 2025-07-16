defineRouteMeta({
	openAPI: {
		$global: {
			components: {
				securitySchemes: {
					authentication: {
						type: 'apiKey',
						description: 'The default authentication method, same as logging in on the website.',
						in: 'cookie',
						name: 'tstats-auth',
					},
				},
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
	},
});

export default defineEventHandler((event) => {
	setResponseStatus(event, 404, 'Not Found');
	// return event
});
