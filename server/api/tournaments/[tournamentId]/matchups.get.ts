import { z } from 'zod/v4';

import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const PathParams = z.object({
	tournamentId: z.string().min(1),
});

const team1 = alias(teamTable, 'team1');
const team2 = alias(teamTable, 'team2');

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await getUser(event);
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));

		let selectedMatchupsRows = await db.select({
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
			.leftJoin(team2, eq(team2.teamId, matchupTable.team2Id))
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
					hasTournamentViewPermissions(user),
				),
			);

		if (selectedMatchupsRows.length == 0) {
			throw createNotFoundError('Tournament');
		}

		if (selectedMatchupsRows[0]!.matchup?.matchupId == undefined) {
			selectedMatchupsRows = [];
		}

		// collect all promises for team images without duplicates and batch execute them
		const teamImagesPromises = new Map<string, Promise<string | null>>();

		for (const row of selectedMatchupsRows) {
			if (row.team1 && !teamImagesPromises.has(row.team1.teamId)) {
				teamImagesPromises.set(row.team1.teamId, getSignedTeamImage(event, tournamentId, row.team1.teamId));
			}
			if (row.team2 && !teamImagesPromises.has(row.team2.teamId)) {
				teamImagesPromises.set(row.team2.teamId, getSignedTeamImage(event, tournamentId, row.team2.teamId));
			}
		}

		const teamIds = Array.from(teamImagesPromises.keys());
		const results = await Promise.all(teamImagesPromises.values());
		const teamImages = new Map<string, string | null>();
		results.forEach((image, i) => {
			teamImages.set(teamIds[i]!, image);
		});

		// aggregate our rows
		const selectedMatchups: Record<string, MatchupDetails> = {};
		for (const row of selectedMatchupsRows) {
			const currentMatchup = row.matchup;
			const team1 = row.team1;
			const team2 = row.team2;
			const currentGame = row.game;

			if (currentMatchup == null || team1 == null || team2 == null) {
				continue;
			}

			selectedMatchups[currentMatchup.matchupId] ??= {
				...currentMatchup,
				team1: {
					...team1,
					imageUrl: teamImages.get(team1.teamId) ?? null,
				},
				team2: {
					...team2,
					imageUrl: teamImages.get(team2.teamId) ?? null,
				},
				games: [],
			};

			if (currentGame) {
				selectedMatchups[currentMatchup.matchupId]!.games.push(currentGame);
			}
		}

		return selectedMatchups;
	}),
});
