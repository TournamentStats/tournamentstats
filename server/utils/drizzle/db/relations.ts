import { relations } from 'drizzle-orm/relations';
import { tournamentTable, tournamentShareTokenTable, teamTable, playerTable, tournamentParticipantTable, matchupTable, matchupTeamTable, matchupGameTable, matchupGameTeamTable, gameTable, gamePlayerDetailsTable, gameTeamDetailsTable } from './schema';

import { authUsers } from 'drizzle-orm/supabase';

export const tournamentRelations = relations(tournamentTable, ({ one, many }) => ({
	user: one(authUsers, {
		fields: [tournamentTable.ownerId],
		references: [authUsers.id],
	}),
	tournamentShareTokens: many(tournamentShareTokenTable),
	teams: many(teamTable),
	tournamentParticipants: many(tournamentParticipantTable),
	matchups: many(matchupTable),
	matchupTeams: many(matchupTeamTable),
}));

export const usersInAuthRelations = relations(authUsers, ({ many }) => ({
	tournaments: many(tournamentTable),
}));

export const tournamentShareTokenRelations = relations(tournamentShareTokenTable, ({ one }) => ({
	tournament: one(tournamentTable, {
		fields: [tournamentShareTokenTable.tournamentId],
		references: [tournamentTable.tournamentId],
	}),
}));

export const teamRelations = relations(teamTable, ({ one, many }) => ({
	tournament: one(tournamentTable, {
		fields: [teamTable.tournamentId],
		references: [tournamentTable.tournamentId],
	}),
	tournamentParticipants: many(tournamentParticipantTable),
	matchupTeams: many(matchupTeamTable),
}));

export const tournamentParticipantRelations = relations(tournamentParticipantTable, ({ one }) => ({
	player: one(playerTable, {
		fields: [tournamentParticipantTable.puuid],
		references: [playerTable.puuid],
	}),
	tournament: one(tournamentTable, {
		fields: [tournamentParticipantTable.tournamentId],
		references: [tournamentTable.tournamentId],
	}),
	team: one(teamTable, {
		fields: [tournamentParticipantTable.tournamentId],
		references: [teamTable.teamId],
	}),
}));

export const playerRelations = relations(playerTable, ({ many }) => ({
	tournamentParticipants: many(tournamentParticipantTable),
	gamePlayerDetails: many(gamePlayerDetailsTable),
}));

export const matchupRelations = relations(matchupTable, ({ one, many }) => ({
	tournament: one(tournamentTable, {
		fields: [matchupTable.tournamentId],
		references: [tournamentTable.tournamentId],
	}),
	matchupTeams: many(matchupTeamTable),
	matchupGames: many(matchupGameTable),
}));

export const matchupTeamRelations = relations(matchupTeamTable, ({ one, many }) => ({
	tournament: one(tournamentTable, {
		fields: [matchupTeamTable.tournamentId],
		references: [tournamentTable.tournamentId],
	}),
	matchup: one(matchupTable, {
		fields: [matchupTeamTable.matchupId],
		references: [matchupTable.matchupId],
	}),
	team: one(teamTable, {
		fields: [matchupTeamTable.teamId],
		references: [teamTable.teamId],
	}),
	matchupGameTeams: many(matchupGameTeamTable),
}));

export const matchupGameTeamRelations = relations(matchupGameTeamTable, ({ one }) => ({
	matchupGame: one(matchupGameTable, {
		fields: [matchupGameTeamTable.matchupId],
		references: [matchupGameTable.gameId],
	}),
	matchupTeam: one(matchupTeamTable, {
		fields: [matchupGameTeamTable.matchupId],
		references: [matchupTeamTable.matchupId],
	}),
}));

export const matchupGameRelations = relations(matchupGameTable, ({ one, many }) => ({
	matchupGameTeams: many(matchupGameTeamTable),
	game: one(gameTable, {
		fields: [matchupGameTable.gameId],
		references: [gameTable.gameId],
	}),
	matchup: one(matchupTable, {
		fields: [matchupGameTable.matchupId],
		references: [matchupTable.matchupId],
	}),
}));

export const gameRelations = relations(gameTable, ({ many }) => ({
	matchupGames: many(matchupGameTable),
	gamePlayerDetails: many(gamePlayerDetailsTable),
	gameTeamDetails: many(gameTeamDetailsTable),
}));

export const gamePlayerDetailsRelations = relations(gamePlayerDetailsTable, ({ one }) => ({
	game: one(gameTable, {
		fields: [gamePlayerDetailsTable.gameId],
		references: [gameTable.gameId],
	}),
	player: one(playerTable, {
		fields: [gamePlayerDetailsTable.puuid],
		references: [playerTable.puuid],
	}),
}));

export const gameTeamDetailsRelations = relations(gameTeamDetailsTable, ({ one }) => ({
	game: one(gameTable, {
		fields: [gameTeamDetailsTable.gameId],
		references: [gameTable.gameId],
	}),
}));
