import type { LolRegion } from 'riotapi-fetch-typed';

export async function insertPlayer(account: Account, summoner: Summoner, region: LolRegion) {
	await db.insert(playerTable)
		.values({
			puuid: account.puuid,
			gameName: account.gameName,
			tagLine: account.tagLine,
			region: region,
			profileIconId: summoner.profileIconId,
		})
		.onConflictDoUpdate({
			target: playerTable.puuid,
			set: {
				puuid: account.puuid,
				gameName: account.gameName,
				tagLine: account.tagLine,
				region: region,
				profileIconId: summoner.profileIconId,
			},
		});
}
