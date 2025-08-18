import { RiotError, type LolRegion, type components } from 'riotapi-fetch-typed';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import * as z from 'zod/v4';

const PathParams = z.object({
	tournamentId: z.string(),
	matchupId: z.string(),
	gameId: z.string(),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);

		const { tournamentId, matchupId, gameId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));

		const context = await db.select()
			.from(tournamentTable)
			.leftJoin(matchupTable, eq(matchupTable.tournamentId, tournamentTable.tournamentId))
			.leftJoin(gameTable, eq(gameTable.gameId, matchupTable.matchupId))
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					eq(matchupTable.shortId, matchupId),
					eq(gameTable, gameId),
					hasTournamentModifyPermissions(user),
				),
			)
			.then(maybeSingle);

		if (!context) {
			throw createNotFoundError('Tournament');
		}

		if (!context.matchup) {
			throw createNotFoundError('Matchup');
		}

		if (!context.game) {
			throw createNotFoundError('Game');
		}

		const game = context.game;

		const { createdAt: gamePlayerDetailsTableCreatedAt, ...gamePlayerDetailsRest } = getTableColumns(gamePlayerDetailsTable);

		const playerDetails = await db.select(gamePlayerDetailsRest)
			.from(gamePlayerDetailsTable)
			.where(
				eq(gamePlayerDetailsTable.gameId, game.gameId),
			);

		const {
			createdAt: gameTeamDetailsTableCreatedAt,
			...gameTeamDetailsTableRest
		} = getTableColumns(gameTeamDetailsTable);

		const teamDetails = await db.select({
			...gameTeamDetailsTableRest,
			teamId: teamTable.shortId,
		})
			.from(gameTeamDetailsTable)
			.innerJoin(teamTable, eq(teamTable.teamId, gameTeamDetailsTable.teamId))
			.where(
				eq(gameTeamDetailsTable.gameId, game.gameId),
			);

		const gameDetails = transformToGame(game, playerDetails, teamDetails);

		return gameDetails;
	}),
});

interface BaseGame {
	gameId: string;
	gameStart: Date | null;
	gameDuration: number | null;
}

interface BasePlayerDetails {
	side: Side;
}

interface BaseTeamDetails {
	side: Side;
	teamId: string | null;
}

function transformToGame<
	PlayerDetails extends BasePlayerDetails,
	TeamDetails extends BaseTeamDetails,
>(
	game: BaseGame,
	playerDetails: PlayerDetails[],
	teamDetails: TeamDetails[],
) {
	const blueTeamPlayers: PlayerDetails[] = [];
	const redTeamPlayers: PlayerDetails[] = [];

	for (const details of playerDetails) {
		switch (details.side) {
			case 'BLUE':
				blueTeamPlayers.push(details);
				break;
			case 'RED':
				redTeamPlayers.push(details);
				break;
		}
	}

	return {
		gameId: game.gameId,
		gameStart: game.gameStart,
		gameDuration: game.gameDuration,
		teams: teamDetails.map(details => ({
			...details,
			players: details.side === 'BLUE' ? blueTeamPlayers : redTeamPlayers,
		})),
	};
}
