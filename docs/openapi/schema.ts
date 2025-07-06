import type { ComponentsObject } from 'openapi-typescript'

export const components: ComponentsObject = {
	securitySchemes: {
		auth: {
			type: 'apiKey',
			description: 'The default authentication method, same as logging in on the website.',
			in: 'cookie',
			name: 'tstats-auth',
		},
	},
}
