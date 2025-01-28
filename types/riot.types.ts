export interface RiotError {
	status: {
		message: string
		status_code: number
	}
}

export interface Account {
	puuid: string
	gameName: string
	tagLine: string
}

export interface Summoner {
	accountId: string
	profileIconId: number
	revisionDate: number
	id: string
	puuid: string
	summonerLevel: number
}
