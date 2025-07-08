import * as z from 'zod/v4'
import { withErrorHandling } from '~~/server/utils/errors'

const Query = z.object({
	error: z.string('This query parameter is required'),
	test: z.string('requiored').min(2, 'min length 2').startsWith('a'),
})

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const { error } = await getValidatedQuery(event, obj => Query.parse(obj))
		switch (error) {
			case 'h3error':
				throw createError('H3Error')
			case 'h3error400':
				throw createError({
					statusCode: 400,
					statusMessage: 'Not Found',
					statusText: '400 noddy foundy',
				})
			case 'unknown':
				throw new Error('unexpected error')
		}
		return 'no error'
	}),
})
