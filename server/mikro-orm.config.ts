import 'dotenv/config';

import { PostgreSqlDriver, type Options } from '@mikro-orm/postgresql';

import {
	BaseEntity,
	SupabaseUser,
	Tournament,
	TournamentShareToken,
	Team,
	TournamentTeamParticipation,
	Player,
	TournamentPlayerParticipation,
	Matchup,
	Game,
	GamePlayerDetails,
	GameTeamDetails,
	MatchupGame,
	MatchupGameTeamParticipation,
	MatchupTeamParticipation,
} from './entities';

// import { BaseEntity } from './entities/base.entity';

const config: Options = {
	driver: PostgreSqlDriver,
	clientUrl: process.env.NUXT_DB_URL,
	entities: [
		BaseEntity,
		SupabaseUser,
		Tournament,
		TournamentShareToken,
		Team,
		TournamentTeamParticipation,
		Player,
		TournamentPlayerParticipation,
		Matchup,
		Game,
		GamePlayerDetails,
		GameTeamDetails,
		MatchupGame,
		MatchupGameTeamParticipation,
		MatchupTeamParticipation,
	],
	metadataProvider: undefined,
	debug: true,
};

export default config;
