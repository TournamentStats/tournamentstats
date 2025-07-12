import { createRiotFetch } from 'riotapi-fetch-typed'

export const riotFetch = createRiotFetch({
	apiKey: useRuntimeConfig().riotGamesApiKey,
})
