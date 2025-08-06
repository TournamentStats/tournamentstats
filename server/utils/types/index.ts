export type openAPISchema = ReturnType<typeof defineRouteMeta>['openAPI'];

export interface MatchupDetails {
	matchupId: string;
	team1: {
		teamId: string;
		name: string;
		abbreviation: string | null;
	};
	team2: {
		teamId: string;
		name: string;
		abbreviation: string | null;
	};
	games: {
		gameId: number;
		ordering: number | null;
	}[];
}
