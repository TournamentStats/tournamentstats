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
			},
		},
	},
})

export default defineEventHandler((event) => {
	setResponseStatus(event, 404, 'Not Found')
	// return event
})
