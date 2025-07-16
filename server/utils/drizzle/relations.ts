import { relations } from 'drizzle-orm/relations';
import { game, championBan, team, gameMatchupRelation, matchup, gamePlayerStats, player, gameTeamStats, tournament, usersInAuth, tournamentParticipant, tournamentShareToken } from './schema';

export const championBanRelations = relations(championBan, ({ one }) => ({
	game: one(game, {
		fields: [championBan.gameId],
		references: [game.gameId],
	}),
	team: one(team, {
		fields: [championBan.teamId],
		references: [team.teamId],
	}),
}));

export const gameRelations = relations(game, ({ many }) => ({
	championBans: many(championBan),
	matchups: many(gameMatchupRelation),
	playerStats: many(gamePlayerStats),
	teamStats: many(gameTeamStats),
}));

export const teamRelations = relations(team, ({ one, many }) => ({
	championBans: many(championBan),
	gameStats: many(gameTeamStats),
	matchupsAsTeam1: many(matchup, {
		relationName: 'matchup_tournamentId_team1_teamId',
	}),
	matchupsAsTeam2: many(matchup, {
		relationName: 'matchup_tournamentId_team2_teamId',
	}),
	tournament: one(tournament, {
		fields: [team.tournamentId],
		references: [tournament.tournamentId],
	}),
	members: many(tournamentParticipant),
}));

export const gameMatchupRelationRelations = relations(gameMatchupRelation, ({ one }) => ({
	game: one(game, {
		fields: [gameMatchupRelation.gameId],
		references: [game.gameId],
	}),
	matchup: one(matchup, {
		fields: [gameMatchupRelation.matchupId],
		references: [matchup.matchupId],
	}),
}));

export const matchupRelations = relations(matchup, ({ one, many }) => ({
	games: many(gameMatchupRelation),
	tournament: one(tournament, {
		fields: [matchup.tournamentId],
		references: [tournament.tournamentId],
	}),
	team1: one(team, {
		fields: [matchup.tournamentId],
		references: [team.teamId],
		relationName: 'matchup_tournamentId_team1_teamId',
	}),
	team2: one(team, {
		fields: [matchup.tournamentId],
		references: [team.teamId],
		relationName: 'matchup_tournamentId_team2_teamId',
	}),
}));

export const gamePlayerStatsRelations = relations(gamePlayerStats, ({ one }) => ({
	game: one(game, {
		fields: [gamePlayerStats.gameId],
		references: [game.gameId],
	}),
	player: one(player, {
		fields: [gamePlayerStats.puuid],
		references: [player.puuid],
	}),
}));

export const playerRelations = relations(player, ({ many }) => ({
	gameStats: many(gamePlayerStats),
	tournaments: many(tournamentParticipant),
}));

export const gameTeamStatsRelations = relations(gameTeamStats, ({ one }) => ({
	game: one(game, {
		fields: [gameTeamStats.gameId],
		references: [game.gameId],
	}),
	team: one(team, {
		fields: [gameTeamStats.teamId],
		references: [team.teamId],
	}),
}));

export const tournamentRelations = relations(tournament, ({ one, many }) => ({
	matchups: many(matchup),
	teams: many(team),
	users: one(usersInAuth, {
		fields: [tournament.ownerId],
		references: [usersInAuth.id],
	}),
	participants: many(tournamentParticipant),
	shareTokens: many(tournamentShareToken),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
	tournaments: many(tournament),
}));

export const tournamentParticipantRelations = relations(tournamentParticipant, ({ one }) => ({
	player: one(player, {
		fields: [tournamentParticipant.puuid],
		references: [player.puuid],
	}),
	tournament: one(tournament, {
		fields: [tournamentParticipant.tournamentId],
		references: [tournament.tournamentId],
	}),
	team: one(team, {
		fields: [tournamentParticipant.tournamentId],
		references: [team.teamId],
	}),
}));

export const tournamentShareTokenRelations = relations(tournamentShareToken, ({ one }) => ({
	tournament: one(tournament, {
		fields: [tournamentShareToken.tournamentId],
		references: [tournament.tournamentId],
	}),
}));
