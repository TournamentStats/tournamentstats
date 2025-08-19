import 'dotenv/config';

import { PostgreSqlDriver, type Options } from '@mikro-orm/postgresql';
// import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

// import {
// 	FormatAbbrevation,
// 	Game,
// 	GamePlayerDetails,
// 	GameTeamDetails,
// 	Matchup,
// 	MatchupGame,
// 	MatchupGameTeam,
// 	MatchupTeam,
// 	Player,
// 	Tournament,
// 	TournamentParticipant,
// 	TournamentShareToken,
// 	SupabaseUser,
// } from './entities';

const config: Options = {
	// for simplicity, we use the SQLite database, as it's available pretty much everywhere
	driver: PostgreSqlDriver,
	clientUrl: process.env.NUXT_DB_URL,
	// entities: [
	// 	FormatAbbrevation,
	// 	Game,
	// 	GamePlayerDetails,
	// 	GameTeamDetails,
	// 	Matchup,
	// 	MatchupGame,
	// 	MatchupGameTeam,
	// 	MatchupTeam,
	// 	Player,
	// 	Tournament,
	// 	TournamentParticipant,
	// 	TournamentShareToken,
	// 	SupabaseUser,
	// ],
	entities: [
		'server/entities/**/*.ts',
	],
	// metadataProvider: TsMorphMetadataProvider,
	debug: true,
};

export default config;
