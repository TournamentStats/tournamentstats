export type openAPISchema = ReturnType<typeof defineRouteMeta>['openAPI'];

export interface TeamDetails {
	teamId: string;
	name: string;
	abbreviation: string | null;
	imageUrl: string | null;
}

export interface GameDetails {
	gameId: string;
	ordering: number | null;
}

export interface MatchupDetails {
	matchupId: string;
	team1: TeamDetails;
	team2: TeamDetails;
	games: GameDetails[];
}
