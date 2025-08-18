export interface Tournament {
	imageUrl: string | null;
	tournamentId: string;
	name: string;
	ownerId: string;
	startDate: string | null;
	endDate: string | null;
	isPrivate: boolean;
	region: 'br1' | 'eun1' | 'euw1' | 'jp1' | 'kr' | 'la1' | 'la2' | 'me1' | 'na1' | 'oc1' | 'ph2' | 'ru' | 'sg2' | 'th2' | 'tr1' | 'tw2' | 'vn2';
	teams: Team[];
	matchups: Matchup[];
	participants: Participant[];
}

export interface Team {
	teamId: string;
	name: string;
	abbreviation: string | null;
	imageUrl: string | null;
	members: Participant[];
}

export interface Matchup {
	matchupId: string;
	team1: Team;
	team2: Team;
	games: Game[];
}

export interface Game {
	gameId: number;
	ordering: number | null;
	details: GameDetails;
}

export interface GameDetails {
	gameId: number;
	teams: IngameTeamDetails[];
	players: PlayerDetails[];
}

export interface IngameTeamDetails {
	team: 'BLUE' | 'RED';
	won: boolean;
	players: string[];
}

export interface PlayerDetails {
	team: 'BLUE' | 'RED';
	won: boolean;
	championId: number;
	kills: number;
	deaths: number;
	assists: number;
}

export interface Participant {
	puuid: string;
	name: string;
}
