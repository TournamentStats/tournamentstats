import { DefaultLogger as MikroLogger, MikroORM, PostgreSqlDriver, type LogContext, type LoggerNamespace } from '@mikro-orm/postgresql';

import {
	BaseEntity,
	Game,
	GamePlayerDetails,
	GameTeamDetails,
	Matchup,
	MatchupGame,
	MatchupGameTeamParticipation,
	MatchupTeamParticipation,
	Player,
	Tournament,
	TournamentPlayerParticipation,
	TournamentTeamParticipation,
	TournamentShareToken,
	SupabaseUser,
} from '../entities';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

let orm: MikroORM | null = null;

class MyMikroLogger extends MikroLogger {
	log(namespace: LoggerNamespace, message: string, context?: LogContext) {
		logger.log(
			context?.level ?? 'info',
			message,
			{
				section: `MikroORM - ${namespace}`,
				payload: { query: context?.query },
			},
		);
	}
}

export async function getORM() {
	orm ??= await MikroORM.init({
		driver: PostgreSqlDriver,
		clientUrl: useRuntimeConfig().db.url,
		entities: [
			BaseEntity,
			Game,
			GamePlayerDetails,
			GameTeamDetails,
			Matchup,
			MatchupGame,
			MatchupGameTeamParticipation,
			MatchupTeamParticipation,
			Player,
			Tournament,
			TournamentPlayerParticipation,
			TournamentTeamParticipation,
			TournamentShareToken,
			SupabaseUser,
		],
		entitiesTs: [SupabaseUser],
		metadataProvider: undefined,
		debug: true,
		colors: true,
		highlighter: new SqlHighlighter(),
		loggerFactory: options => new MyMikroLogger(options),
	});
	return orm;
}

export async function closeORM() {
	if (orm) {
		await orm.close();
	}
}
