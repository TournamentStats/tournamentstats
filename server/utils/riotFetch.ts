import type { H3Event } from 'h3'

import type { FetchOptions, FetchRequest, IFetchError } from 'ofetch'

import type { RiotError } from '~/types/riot.types'

export enum Region {
	AMERICAS = 'americas',
	ASIA = 'asia',
	EUROPE = 'europe',
	ESPORTS = 'esports',
}

export enum Platform {
	BR1 = 'br1',
	EUN1 = 'eun1',
	EUW1 = 'euw1',
	JP1 = 'jp1',
	KR = 'kr',
	LA1 = 'la1',
	LA2 = 'la2',
	ME1 = 'me1',
	NA1 = 'na1',
	OC1 = 'oc1',
	PH2 = 'ph2',
	RU = 'ru',
	SG2 = 'sg2',
	TH2 = 'th2',
	TR1 = 'tr1',
	TW2 = 'tw2',
	VN2 = 'vn2',
}

function isRiotError(error: unknown): error is IFetchError<RiotError> {
	return (error as IFetchError<RiotError>).data?.status !== undefined
}

export async function riotFetch<T>(
	event: H3Event,
	region: Region | Platform | string,
	request: FetchRequest,
	options?: Omit<FetchOptions, 'baseURL' | 'retryStatusCodes'>,
): Promise<T> {
	const opts = options ?? {}
	opts.headers['X-Riot-Token'] = process.env.RIOT_GAMES_API_KEY ?? ''

	return $fetch<T>(request, {
		baseURL: `https://${region}.api.riotgames.com/`,
		retryStatusCodes: [408, 409, 425, 500, 502, 503, 504],
		...opts,
	}).catch((error: unknown) => {
		if (isRiotError(error)) {
			const status_code = error.data?.status.status_code ?? 500
			const message = error.data.status.message

			if (status_code == 400 || status_code == 404) {
				throw createError({
					statusCode: error.data.status.status_code,
					statusMessage: message.split(' - ')[0],
					message: message.split(' - ')[1] ?? '',
				})
			}

			event.context.errors.push(error)

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
	})
}
