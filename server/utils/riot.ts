import { createRiotFetch, RiotError } from 'riotapi-fetch-typed';
import type { LolRegion } from 'riotapi-fetch-typed';

export const riotFetch = createRiotFetch({
	apiKey: useRuntimeConfig().riotGamesApiKey,
	throwOnResponseError: true,
});

export function regionToCluster(region: LolRegion) {
	switch (region) {
		case 'br1':
		case 'la1':
		case 'la2':
		case 'na1':
			return 'americas';
		case 'eun1':
		case 'euw1':
		case 'tr1':
			return 'europe';
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
			return 'asia';
	}
}

export async function fetchPlayer(puuid: string, region: LolRegion) {
	let account: Account;
	try {
		account = (await riotFetch(`/riot/account/v1/accounts/by-puuid/${puuid}`, {
			region: regionToCluster(region),
		})).data;
	}
	catch (e: unknown) {
		if (e instanceof RiotError) {
			if (e.statusCode === 404) {
				throw createNotFoundError('PUUID');
			}
		}
		throw e;
	}

	let summoner: Summoner;
	try {
		summoner = (await riotFetch(`/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
			region,
		})).data;
	}
	catch (e: unknown) {
		if (e instanceof RiotError) {
			if (e.statusCode === 404) {
				throw createNotFoundError('Summoner');
			}
		}
		throw e;
	}

	return { account, summoner };
}
