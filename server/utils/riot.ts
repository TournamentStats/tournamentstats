import { createRiotFetch } from 'riotapi-fetch-typed'
import type { LolRegion } from 'riotapi-fetch-typed'

export const riotFetch = createRiotFetch({
	apiKey: useRuntimeConfig().riotGamesApiKey,
	throwOnResponseError: true,
})

export function regionToCluster(region: LolRegion) {
	switch (region) {
		case 'br1':
		case 'la1':
		case 'la2':
		case 'na1':
			return 'americas'
		case 'eun1':
		case 'euw1':
		case 'tr1':
			return 'europe'
		case 'jp1':
		case 'kr':
		case 'me1':
		case 'oc1':
		case 'ph2':
		case 'ru':
		case 'sg2':
		case 'th2':
		case 'tw2':
		case 'vn2':
			return 'asia'
	}
}

// const riotFetch: typeof riotFetchInternal = async (...args) => {
// 	const { response, data, error } = await riotFetchInternal(...args)

// 	if (error) {
// 		throw createGenericError
// 	}
// }
