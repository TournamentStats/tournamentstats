import { z } from 'zod/v4';

import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const team1 = alias(teamTable, 'team1');
const team2 = alias(teamTable, 'team2');

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
		const { tournamentId, matchupId } = await getValidatedRouterParams(
			event,
			obj => PathParams.parse(obj),
		);

		const result = await db.select({
			matchup: {
				matchupId: matchupTable.shortId,
				format: matchupTable.format,
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
				gameId: gameMatchupRelationTable.gameId,
				ordering: gameMatchupRelationTable.ordering,
			},
		})
			.from(tournamentTable)
			.leftJoin(matchupTable, eq(matchupTable.tournamentId, tournamentTable.tournamentId))
			.leftJoin(team1, eq(team1.teamId, matchupTable.team1Id))
			.leftJoin(team2, eq(team2.teamId, matchupTable.team1Id))
			.leftJoin(
				gameMatchupRelationTable,
				eq(gameMatchupRelationTable.matchupId, matchupTable.matchupId),
			)
			.leftJoin(
				gameTable,
				eq(gameTable.gameId, gameMatchupRelationTable.gameId),
			)
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					eq(matchupTable.shortId, matchupId),
					hasTournamentViewPermissions(user),
				),
			);

		if (result.length == 0) {
			throw createNotFoundError('Tournament');
		}

		if (result[0]!.matchup?.matchupId == undefined) {
			throw createNotFoundError('Matchup');
		}

		let selectedMatchup: MatchupDetails | undefined = undefined;
		for (const row of result) {
			const currentMatchup = row.matchup;
			const team1 = row.team1;
			const team2 = row.team2;
			const currentGame = row.game;

			if (currentMatchup == null || team1 == null || team2 == null) continue;

			// because we only fetch 2 images, we don't need to batch them
			selectedMatchup = {
				...currentMatchup,
				team1: {
					...team1,
					imageUrl: await getSignedTeamImage(event, tournamentId, team1.teamId),
				},
				team2: {
					...team2,
					imageUrl: await getSignedTeamImage(event, tournamentId, team2.teamId),
				},
				games: [],
			};

			if (currentGame) {
				selectedMatchup.games.push(currentGame);
			}
		}

		if (!selectedMatchup) {
			throw new Error('Matchup should have been defined by now');
		}

		return selectedMatchup;
	}),
});
