import { pgTable, index, foreignKey, check, integer, text, timestamp, varchar, uuid, date, boolean, smallint, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { authUsers } from 'drizzle-orm/supabase';

export const formats = ['Best of 1', 'Best of 2', 'Best of 3', 'Best of 5', 'Other'] as const;
export type Format = typeof formats[number];
export const pgFormat = pgEnum('format', formats);

export const regions = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'me1', 'na1', 'oc1', 'ph2', 'ru', 'sg2', 'th2', 'tr1', 'tw2', 'vn2'] as const;
export type Region = typeof regions[number];
export const pgRegion = pgEnum('region', regions);

export const sides = ['BLUE', 'RED'] as const;
export type Side = typeof sides[number];
export const pgSide = pgEnum('side', sides);

export const lolPositions = ['TOP', 'JUNGLE', 'MID', 'BOTTOM', 'SUPPORT'] as const;
export type lolPosition = typeof lolPositions[number];
export const pgLolPosition = pgEnum('lol_position', lolPositions);

export const tournamentTable = pgTable('tournament', {
	tournamentId: integer('tournament_id').generatedByDefaultAsIdentity({ name: 'tournament_tournament_id_seq', startWith: 203, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	shortId: text('short_id').notNull().generatedAlwaysAs(sql`encode_id_salted((tournament_id)::bigint, private.get_salt('tournament'::text))`),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	name: varchar({ length: 64 }).notNull(),
	ownerId: uuid('owner_id').notNull(),
	startDate: date('start_date', { mode: 'date' }),
	endDate: date('end_date', { mode: 'date' }),
	isPrivate: boolean('is_private').notNull(),
	region: pgRegion().notNull(),
}, table => [
	index('index_tournament_ownerid').using('btree', table.ownerId.asc().nullsLast().op('uuid_ops')),
	index('index_tournament_shortid').using('btree', table.shortId.asc().nullsLast().op('text_ops')),
	foreignKey({
		columns: [table.ownerId],
		foreignColumns: [authUsers.id],
		name: 'tournament_owner_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	check('tournament_check', sql`(start_date IS NULL) OR (end_date IS NULL) OR (end_date >= start_date)`),
]);

export const tournamentShareTokenTable = pgTable('tournament_share_token', {
	id: integer().generatedByDefaultAsIdentity({ name: 'tournament_share_token_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	shareToken: text('share_token').notNull(),
	tournamentId: integer('tournament_id').notNull(),
}, table => [
	index('index_tournament_share_token_sharetoken').using('btree', table.shareToken.asc().nullsLast().op('text_ops')),
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournamentTable.tournamentId],
		name: 'tournament_share_token_tournament_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
]);

export const teamTable = pgTable('team', {
	teamId: integer('team_id').generatedByDefaultAsIdentity({ name: 'team_team_id_seq', startWith: 412, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	shortId: text('short_id').notNull().generatedAlwaysAs(sql`encode_id_salted((team_id)::bigint, private.get_salt('team'::text))`),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	tournamentId: integer('tournament_id').notNull(),
	name: text().notNull(),
	abbreviation: text(),
}, table => [
	index('index_team_shortid').using('btree', table.shortId.asc().nullsLast().op('text_ops')),
	index('index_team_tournamentid').using('btree', table.tournamentId.asc().nullsLast().op('int4_ops')),
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournamentTable.tournamentId],
		name: 'team_tournament_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	check('team_name_check', sql`(length(name) >= 3) AND (length(name) <= 32)`),
	check('team_abbreviation_check', sql`(length(abbreviation) >= 1) AND (length(abbreviation) <= 5)`),
]);

export const playerTable = pgTable('player', {
	puuid: text().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	lastUpdated: timestamp('last_updated', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	profileIconId: integer('profile_icon_id').notNull(),
	gameName: text('game_name'),
	tagLine: text('tag_line'),
	region: pgRegion().notNull(),
}, table => [
	index('index_player_gamename_tagline').using('btree', table.gameName.asc().nullsLast().op('text_ops'), table.tagLine.asc().nullsLast().op('text_ops')),
]);

export const tournamentParticipantTable = pgTable('tournament_participant', {
	puuid: text().notNull(),
	tournamentId: integer('tournament_id').notNull(),
	name: text(),
	teamId: integer('team_id'),
	teamPosition: pgLolPosition('team_position'),
}, table => [
	index('index_tournament_participant_puuid').using('btree', table.puuid.asc().nullsLast().op('text_ops')),
	index('index_tournament_participant_tournamentid_teamid').using('btree', table.tournamentId.asc().nullsLast().op('int4_ops'), table.teamId.asc().nullsLast().op('int4_ops')),
	foreignKey({
		columns: [table.puuid],
		foreignColumns: [playerTable.puuid],
		name: 'tournament_participant_puuid_fkey',
	}).onUpdate('cascade'),
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournamentTable.tournamentId],
		name: 'tournament_participant_tournament_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	foreignKey({
		columns: [table.tournamentId, table.teamId],
		foreignColumns: [teamTable.teamId, teamTable.tournamentId],
		name: 'tournament_participant_tournament_id_team_id_fkey',
	}).onUpdate('cascade').onDelete('set null'),
]);

export const formatAbbrevationTable = pgTable('format_abbrevation', {
	format: pgFormat().notNull(),
	abbrevation: text().notNull(),
});

export const matchupTable = pgTable('matchup', {
	matchupId: integer('matchup_id').generatedByDefaultAsIdentity({ name: 'matchup_matchup_id_seq', startWith: 306, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	shortId: text('short_id').notNull().generatedAlwaysAs(sql`encode_id_salted((matchup_id)::bigint, private.get_salt('matchup'::text))`),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	tournamentId: integer('tournament_id').notNull(),
	format: pgFormat(),
}, table => [
	index('index_matchup_tournamentid').using('btree', table.tournamentId.asc().nullsLast().op('int4_ops')),
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournamentTable.tournamentId],
		name: 'matchup_tournament_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
]);

export const matchupTeamTable = pgTable('matchup_team', {
	matchupId: integer('matchup_id').notNull(),
	teamId: integer('team_id').notNull(),
	ordering: smallint(),
	tournamentId: integer('tournament_id'),
}, table => [
	index('index_matchup_team_tournament_id_matchup_id').using('btree', table.tournamentId.asc().nullsLast().op('int4_ops'), table.matchupId.asc().nullsLast().op('int4_ops')),
	index('index_matchup_team_tournament_id_team_id').using('btree', table.tournamentId.asc().nullsLast().op('int4_ops'), table.teamId.asc().nullsLast().op('int4_ops')),
	foreignKey({
		columns: [table.tournamentId],
		foreignColumns: [tournamentTable.tournamentId],
		name: 'matchup_team_tournament_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	foreignKey({
		columns: [table.matchupId, table.tournamentId],
		foreignColumns: [matchupTable.matchupId, matchupTable.tournamentId],
		name: 'matchup_team_tournament_id_matchup_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	foreignKey({
		columns: [table.teamId, table.tournamentId],
		foreignColumns: [teamTable.teamId, teamTable.tournamentId],
		name: 'matchup_team_tournament_id_team_id_fkey',
	}).onUpdate('cascade'),
	check('matchup_team_ordering_check', sql`(ordering >= 1) AND (ordering <= 2)`),
]);

export const matchupGameTeamTable = pgTable('matchup_game_team', {
	matchupId: integer('matchup_id').notNull(),
	gameId: text('game_id').notNull(),
	side: pgSide().notNull(),
	teamId: integer('team_id').notNull(),
}, table => [
	foreignKey({
		columns: [table.matchupId, table.gameId],
		foreignColumns: [matchupGameTable.gameId, matchupGameTable.matchupId],
		name: 'matchup_game_team_matchup_id_game_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	foreignKey({
		columns: [table.matchupId, table.teamId],
		foreignColumns: [matchupTeamTable.matchupId, matchupTeamTable.teamId],
		name: 'matchup_game_team_matchup_id_team_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
]);

export const gameTable = pgTable('game', {
	gameId: text('game_id').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	gameDuration: smallint('game_duration'),
	gameStart: timestamp('game_start', { withTimezone: true, mode: 'date' }).notNull(),
});

export const matchupGameTable = pgTable('matchup_game', {
	gameId: text('game_id'),
	matchupId: integer('matchup_id').notNull(),
	ordering: smallint().notNull(),
}, table => [
	index('index_game_matchup_gameid').using('btree', table.gameId.asc().nullsLast().op('text_ops')),
	foreignKey({
		columns: [table.gameId],
		foreignColumns: [gameTable.gameId],
		name: 'matchup_game_game_id_fkey',
	}).onUpdate('cascade'),
	foreignKey({
		columns: [table.matchupId],
		foreignColumns: [matchupTable.matchupId],
		name: 'matchup_game_matchup_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
]);

export const gamePlayerDetailsTable = pgTable('game_player_details', {
	puuid: text().notNull(),
	gameId: text('game_id').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	champId: smallint('champ_id').notNull(),
	position: text(),
	participantId: smallint('participant_id').notNull(),
	side: pgSide().notNull(),
	item0: integer(),
	item1: integer(),
	item2: integer(),
	item3: integer(),
	item4: integer(),
	item5: integer(),
	item6: integer(),
	capstoneRuneId: integer('capstone_rune_id'),
	primaryRune1Id: integer('primary_rune1_id'),
	primaryRune2Id: integer('primary_rune2_id'),
	primaryRune3Id: integer('primary_rune3_id'),
	subRune1Id: integer('sub_rune1_id'),
	subRune2Id: integer('sub_rune2_id'),
	statDefense: integer('stat_defense'),
	statFlex: integer('stat_flex'),
	statOffense: integer('stat_offense'),
	summoner1Id: smallint('summoner1_id'),
	summoner2Id: smallint('summoner2_id'),
	win: boolean(),
	champLevel: smallint('champ_level'),
	kills: smallint(),
	deaths: smallint(),
	assists: smallint(),
	doubleKills: smallint('double_kills'),
	tripleKills: smallint('triple_kills'),
	quadraKills: smallint('quadra_kills'),
	pentaKills: smallint('penta_kills'),
	firstBloodKill: boolean('first_blood_kill'),
	firstTowerKill: boolean('first_tower_kill'),
	totalEnemyJungleMinionKills: smallint('total_enemy_jungle_minion_kills'),
	totalMinionKills: smallint('total_minion_kills'),
	turretKills: smallint('turret_kills'),
	ccScore: smallint('cc_score'),
	objectivesStolen: smallint('objectives_stolen'),
	goldEarned: integer('gold_earned'),
	damageToTurrets: integer('damage_to_turrets'),
	totalDamageDealtToChampions: integer('total_damage_dealt_to_champions'),
	magicDamageDealtToChampions: integer('magic_damage_dealt_to_champions'),
	physicalDamageDealtToChampions: integer('physical_damage_dealt_to_champions'),
	trueDamageDealtToChampions: integer('true_damage_dealt_to_champions'),
	totalDamageTaken: integer('total_damage_taken'),
	phyiscalDamageTaken: integer('phyiscal_damage_taken'),
	magicalDamageTaken: integer('magical_damage_taken'),
	trueDamageTaken: integer('true_damage_taken'),
	damageSelfMitigated: integer('damage_self_mitigated'),
	totalHealingDone: integer('total_healing_done'),
	totalAllyHealing: integer('total_ally_healing'),
	totalDamageShielded: integer('total_damage_shielded'),
	visionScore: smallint('vision_score'),
	wardsKilled: smallint('wards_killed'),
	wardsPlaced: smallint('wards_placed'),
}, table => [
	index('index_game_player_details_gameid').using('btree', table.gameId.asc().nullsLast().op('text_ops')),
	foreignKey({
		columns: [table.gameId],
		foreignColumns: [gameTable.gameId],
		name: 'game_player_details_game_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
	foreignKey({
		columns: [table.puuid],
		foreignColumns: [playerTable.puuid],
		name: 'game_player_details_puuid_fkey',
	}).onUpdate('cascade'),
]);

export const gameTeamDetailsTable = pgTable('game_team_details', {
	side: pgSide().notNull(),
	gameId: text('game_id').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	bans: smallint().array(),
	featEpicMonsterKill: boolean('feat_epic_monster_kill'),
	featFirstBlood: boolean('feat_first_blood'),
	featFirstTurret: boolean('feat_first_turret'),
	atakhanKills: smallint('atakhan_kills'),
	baronKills: smallint('baron_kills'),
	dragonKills: smallint('dragon_kills'),
	riftHeraldKills: smallint('rift_herald_kills'),
	grubsKills: smallint('grubs_kills'),
	towerKills: smallint('tower_kills'),
	inhibitorKills: smallint('inhibitor_kills'),
	win: boolean(),
	kills: smallint(),
	deaths: smallint(),
	assists: smallint(),
}, table => [
	foreignKey({
		columns: [table.gameId],
		foreignColumns: [gameTable.gameId],
		name: 'game_team_details_game_id_fkey',
	}).onUpdate('cascade').onDelete('cascade'),
]);
