import { z } from 'zod/v4';

import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const PathParams = z.object({
	tournamentId: z.string().min(1),
	matchupId: z.string().min(1),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await getUser(event);
		const { tournamentId, matchupId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));

		const team1 = alias(team, 'team1');
		const team2 = alias(team, 'team2');

		const selectedMatchupsRows = await db.select({
			matchup: {
				matchupId: matchup.shortId,
				format: matchup.format,
			},
			team1: {
				teamId: team1.shortId,
				name: team1.name,
				abbreviation: team1.abbreviation,
			},
			team2: {
				teamId: team2.shortId,
				name: team2.name,
				abbreviation: team2.abbreviation,
			},
			game: {
				gameId: gameMatchupRelation.gameId,
				ordering: gameMatchupRelation.ordering,
			},
		})
			.from(tournament)
			.leftJoin(matchup, eq(matchup.tournamentId, tournament.tournamentId))
			.leftJoin(team1, eq(team1.teamId, matchup.team1Id))
			.leftJoin(team2, eq(team2.teamId, matchup.team1Id))
			.leftJoin(
				gameMatchupRelation,
				eq(gameMatchupRelation.matchupId, matchup.matchupId),
			)
			.leftJoin(
				game,
				eq(game.gameId, gameMatchupRelation.gameId),
			)
			.where(
				and(
					eq(tournament.shortId, tournamentId),
					eq(matchup.shortId, matchupId),
					hasTournamentViewPermissions(user),
				),
			);

		if (selectedMatchupsRows.length == 0) {
			throw createNotFoundError('Tournament');
		}

		if (selectedMatchupsRows[0]!.matchup?.matchupId == undefined) {
			throw createNotFoundError('Matchup');
		}

		const selectedMatchup = selectedMatchupsRows.reduce<Record<string, MatchupDetails>>((acc, row) => {
			const currentMatchup = row.matchup;
			const team1 = row.team1;
			const team2 = row.team2;
			const currentGame = row.game;

			if (currentMatchup == null || team1 == null || team2 == null) return acc;

			acc[currentMatchup.matchupId] ??= {
				...currentMatchup,
				team1,
				team2,
				games: [],
			};

			if (currentGame) {
				acc[currentMatchup.matchupId]!.games.push(currentGame);
			}

			return acc;
		}, {})[0]!;

		return selectedMatchup;
	}),
});
