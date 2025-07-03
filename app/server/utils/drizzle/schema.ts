import { pgTable, text, index, foreignKey, bigint, integer, smallint, timestamp, boolean, uniqueIndex, varchar, uuid, date, pgEnum, primaryKey } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const format = pgEnum('format', ['Best of 1', 'Best of 2', 'Best of 3', 'Best of 5', 'Other'])
export const side = pgEnum('side', ['BLUE', 'RED'])

export const usersInAuth = pgTable('users', {
	id: uuid('id').primaryKey(),
})

export const formatAbbrevation = pgTable('format_abbrevation', {
	format: format().notNull(),
	abbrevation: text().notNull(),
})

export const championBan = pgTable('champion_ban', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint('game_id', {
		mode: 'number',
	}).notNull(),
	teamId: integer('team_id').notNull(),
	pickTurn: smallint('pick_turn').notNull(),
	championId: smallint('champion_id')
		.notNull(),
}, table => [
	primaryKey({
		columns: [
			table.gameId,
			table.teamId,
			table.pickTurn,
		],
	}),
	index('index_champion_ban_gameid')
		.using('btree',
			table.gameId.asc()
				.nullsLast()
				.op('int8_ops'),
		),
	index('index_champion_ban_teamid')
		.using('btree',
			table.teamId.asc()
				.nullsLast()
				.op('int4_ops'),
		),
	foreignKey({
		columns: [table.gameId],
		foreignColumns: [game.gameId],
		name: 'champion_ban_game_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
	foreignKey({
		columns: [table.teamId],
		foreignColumns: [team.teamId],
		name: 'champion_ban_team_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
])

export const game = pgTable('game', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint('game_id', {
		mode: 'number',
	})
		.primaryKey(),
	createdAt: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	gameDuration: smallint('game_duration'),
	gameStart: timestamp('game_start', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.notNull(),
})

export const gameMatchupRelation = pgTable('game_matchup_relation', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint('game_id', {
		mode: 'number',
	}).notNull(),
	matchupId: integer('matchup_id').notNull(),
}, table => [
	primaryKey({
		columns: [
			table.gameId,
			table.matchupId,
		],
	}),
	index('index_game_matchup_relation_gameid')
		.using('btree',
			table.gameId.asc()
				.nullsLast()
				.op('int8_ops'),
		),
	index('index_game_matchup_relation_matchupid')
		.using('btree',
			table.matchupId.asc()
				.nullsLast()
				.op('int4_ops'),
		),
	foreignKey({
		columns: [table.gameId],
		foreignColumns: [game.gameId],
		name: 'game_matchup_relation_game_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
	foreignKey({
		columns: [table.matchupId],
		foreignColumns: [matchup.matchupId],
		name: 'game_matchup_relation_matchup_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
])

export const gamePlayerStats = pgTable('game_player_stats', {
	puuid: text().notNull(),
	gameId: bigint('game_id', {
		mode: 'number',
	}).notNull(),
	createdAt: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	kills: smallint(),
	deaths: smallint(),
	assists: smallint(),
	champLevel: smallint('champ_level'),
	champId: smallint('champ_id'),
	champName: text('champ_name'),
	doubleKills: smallint('double_kills'),
	tripleKills: smallint('triple_kills'),
	quadraKills: smallint('quadra_kills'),
	pentaKills: smallint('penta_kills'),
	firstBloodKill: boolean('first_blood_kill'),
	goldEarned: integer('gold_earned'),
	position: text(),
	item0: smallint(),
	item1: smallint(),
	item2: smallint(),
	item3: smallint(),
	item4: smallint(),
	item5: smallint(),
	item6: smallint(),
	participantId: smallint('participant_id'),
	turretKills: smallint('turret_kills'),
	enemyJungleMinionKills: smallint('enemy_jungle_minion_kills'),
	totalAllyJungleMinionKills: smallint('total_ally_jungle_minion_kills'),
	totalMinionKills: smallint('total_minion_kills'),
}, table => [
	primaryKey({
		columns: [
			table.puuid,
			table.gameId,
		],
	}),
	index('index_game_player_stats_gameid')
		.using('btree',
			table.gameId.asc()
				.nullsLast()
				.op('int8_ops'),
		),
	index('index_game_player_stats_puuid')
		.using('btree',
			table.puuid.asc()
				.nullsLast()
				.op('text_ops'),
		),
	foreignKey({
		columns: [table.gameId],
		foreignColumns: [game.gameId],
		name: 'game_player_stats_game_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
	foreignKey({
		columns: [table.puuid],
		foreignColumns: [player.puuid],
		name: 'game_player_stats_puuid_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
])

export const gameTeamStats = pgTable('game_team_stats', {
	side: side().notNull(),
	gameId: bigint('game_id', { mode: 'number' }).notNull(),
	teamId: integer('team_id').notNull(),
	createdAt: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	win: boolean(),
	baronKills: smallint('baron_kills'),
	championKills: smallint('champion_kills'),
	dragonKills: smallint('dragon_kills'),
	inhibitorKills: smallint('inhibitor_kills'),
	riftHeraldKills: smallint('rift_herald_kills'),
	towerKills: smallint('tower_kills'),
}, table => [
	primaryKey({
		columns: [
			table.gameId,
			table.teamId,
		],
	}),
	index('index_game_team_stats_gameid')
		.using('btree',
			table.gameId.asc()
				.nullsLast()
				.op('int8_ops'),
		),
	index('index_game_team_stats_teamid')
		.using('btree',
			table.teamId.asc()
				.nullsLast()
				.op('int4_ops'),
		),
	uniqueIndex('unique_game_team')
		.using('btree',
			table.gameId.asc()
				.nullsLast()
				.op('int4_ops'),
			table.teamId.asc()
				.nullsLast()
				.op('int4_ops'),
		),
	foreignKey({
		columns: [table.gameId],
		foreignColumns: [game.gameId],
		name: 'game_team_stats_game_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
	foreignKey({
		columns: [table.teamId],
		foreignColumns: [team.teamId],
		name: 'game_team_stats_team_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('set null'),
])

export const matchup = pgTable('matchup', {
	matchupId: bigint('matchup_id', {
		mode: 'number',
	}).generatedByDefaultAsIdentity({
		name: 'matchup_matchup_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: '9223372036854775807',
		cache: 1,
	}),
	shortId: text('short_id')
		.generatedAlwaysAs(
			sql`encode_id_salted(matchup_id, private.get_salt('matchup'::text))`,
		)
		.notNull()
		.unique(),
	createdAt: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	tournamentId: integer('tournament_id').notNull(),
	team1Id: integer('team1_id').notNull(),
	team2Id: integer('team2_id').notNull(),
	format: format(),
}, table => [
	index('index_matchup_tournamentid')
		.using('btree',
			table.tournamentId.asc()
				.nullsLast()
				.op('int4_ops'),
		),
	index('index_matchup_tournamentid_team1id')
		.using('btree',
			table.tournamentId.asc()
				.nullsLast()
				.op('int4_ops'),
			table.team1Id.asc()
				.nullsLast()
				.op('int4_ops'),
		),
	index('index_matchup_tournamentid_team2id')
		.using('btree',
			table.tournamentId.asc()
				.nullsLast()
				.op('int4_ops'),
			table.team2Id.asc()
				.nullsLast()
				.op('int4_ops'),
		),
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournament.tournamentId],
		name: 'matchup_tournament_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
	foreignKey({
		columns: [table.tournamentId, table.team1Id],
		foreignColumns: [team.teamId, team.tournamentId],
		name: 'matchup_tournament_id_team1_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
	foreignKey({
		columns: [table.tournamentId, table.team2Id],
		foreignColumns: [team.teamId, team.tournamentId],
		name: 'matchup_tournament_id_team2_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
])

export const player = pgTable('player', {
	puuid: text().primaryKey(),
	createdAt: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	lastUpdated: timestamp('last_updated', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	profileIconId: integer('profile_icon_id').notNull(),
	gameName: text('game_name').notNull(),
	tagLine: text('tag_line').notNull(),
})

export const team = pgTable('team', {
	teamId: bigint('team_id', {
		mode: 'number',
	}).generatedByDefaultAsIdentity({
		name: 'team_team_id_seq',
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: '9223372036854775807',
		cache: 1,
	}),
	createdAt: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	tournamentId: integer('tournament_id').notNull(),
	name: text().notNull(),
	shorthand: text(),
	shortId: text('short_id').generatedAlwaysAs(
		sql`encode_id_salted(team_id, private.get_salt('team'::text))`,
	)
		.notNull()
		.unique(),
}, table => [
	index('index_team_tournamentid').using('btree',
		table.tournamentId.asc()
			.nullsLast()
			.op('int4_ops'),
	),
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournament.tournamentId],
		name: 'team_tournament_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
])

export const tournament = pgTable('tournament', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tournamentId: bigint('tournament_id', {
		mode: 'number',
	}).generatedByDefaultAsIdentity(
		{ name: 'tournament_tournament_id_seq',
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: '9223372036854775807',
			cache: 1,
		}),
	shortId: text('short_id').generatedAlwaysAs(
		sql`encode_id_salted(tournament_id, private.get_salt('tournament'::text))`,
	)
		.notNull()
		.unique(),
	createdAt: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
		mode: 'string',
	})
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	name: varchar({ length: 64 }).notNull(),
	ownerId: uuid('owner_id').notNull(),
	startDate: date('start_date'),
	endDate: date('end_date'),
	isPrivate: boolean('is_private').notNull(),
}, table => [
	index('index_tournament_ownerid').using('btree',
		table.ownerId.asc()
			.nullsLast()
			.op('uuid_ops'),
	),
	foreignKey({
		columns: [table.ownerId],
		foreignColumns: [usersInAuth.id],
		name: 'tournament_owner_id_fkey',
	})
		.onUpdate('cascade')
		.onDelete('cascade'),
])

export const tournamentParticipant = pgTable('tournament_participant', {
	puuid: text().notNull(),
	tournamentId: integer('tournament_id').notNull(),
	name: text().notNull(),
	teamId: integer('team_id'),
}, table => [
	primaryKey({
		columns: [
			table.puuid,
			table.tournamentId,
		],
	}),
	index('index_tournament_participant_puuid').using('btree', table.puuid.asc().nullsLast().op('text_ops')),
	index('index_tournament_participant_tournamentid').using('btree', table.tournamentId.asc().nullsLast().op('int4_ops')),
	index('index_tournament_participant_tournamentid_teamid').using('btree', table.tournamentId.asc().nullsLast().op('int4_ops'), table.teamId.asc().nullsLast().op('int4_ops')),
	foreignKey({
		columns: [table.puuid],
		foreignColumns: [player.puuid],
		name: 'tournament_participant_puuid_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournament.tournamentId],
		name: 'tournament_participant_tournament_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	foreignKey({
		columns: [table.tournamentId, table.teamId],
		foreignColumns: [team.teamId, team.tournamentId],
		name: 'tournament_participant_tournament_id_team_id_fkey',
	}).onUpdate('cascade').onDelete('restrict'),
])

export const tournamentShareToken = pgTable('tournament_share_token', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity({ name: 'tournament_share_token_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: '9223372036854775807', cache: 1 }),
	shareToken: text('share_token').notNull(),
	tournamentId: integer('tournament_id').notNull(),
}, table => [
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournament.tournamentId],
		name: 'tournament_share_token_tournament_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
])
