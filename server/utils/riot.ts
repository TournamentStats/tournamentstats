import { createRiotFetch, isRiotError } from 'riot-games-fetch-typed'
import { FetchError } from 'ofetch'
import type { H3Event } from 'h3'

async function myFetch<T>(
	request: string,
	options?: {
		event?: H3Event
		headers?: HeadersInit
		baseURL?: string
		body?: object
	}	& Parameters<typeof $fetch>[1],
): Promise<T> {
	return $fetch<T>(request, options)
		.catch((error: unknown) => {
			if (!(error instanceof FetchError)) {
				throw error
			}

			if (isRiotError(error.data)) {
				const status_code = error.data.status?.status_code ?? 500
				const message = error.data.status?.message ?? 'Something unexpected happened.'

				if (status_code == 400 || status_code == 404) {
					throw createError({
						statusCode: status_code,
						statusMessage: message.split(' - ')[0],
						message: message.split(' - ')[1] ?? '',
					})
				}

				if (options?.event) {
					options.event.context.errors.push(error)
				}

				if (status_code == 429) {
					throw createError({
						statusCode: 429,
						statusMessage: 'Too many requests',
						message: 'We are receiving unexpected high traffic. Please try again later.',
					})
				}

				throw createError({
					statusCode: 500,
					statusMessage: 'Internal Server error',
					message: 'Something unexpected happened.',
				})
			}
			throw error
		})
}

export const riotFetch = createRiotFetch(myFetch, {
	apiKey: useRuntimeConfig().riotGamesApiKey,
})
