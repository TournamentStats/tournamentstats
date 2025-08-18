import { RiotError, type LolRegion, type components } from 'riotapi-fetch-typed';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import * as z from 'zod/v4';

const PathParams = z.object({
	tournamentId: z.string(),
	matchupId: z.string(),
});

const RequestBody = z.object({
	gameId: z.string(),
	blueSideTeamId: z.string(),
	redSideTeamId: z.string(),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);

		const { tournamentId, matchupId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { gameId, blueSideTeamId, redSideTeamId } = await readValidatedBody(event, obj => RequestBody.parse(obj));

		const context = await db.select()
			.from(tournamentTable)
			.leftJoin(matchupTable, eq(matchupTable.tournamentId, tournamentTable.tournamentId))
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					eq(matchupTable.shortId, matchupId),
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

		const teams = await db.select()
			.from(teamTable)
			.where(
				inArray(teamTable, [blueSideTeamId, redSideTeamId]),
			);

		const blueSideTeam = teams.find(team => team.shortId == blueSideTeamId);
		const redSideTeam = teams.find(team => team.shortId == redSideTeamId);

		const fields = [];

		if (!blueSideTeam) {
			fields.push('blueSideTeamId');
		}

		if (!redSideTeam) {
			fields.push('redSideTeamId');
		}

		if (!blueSideTeam || !redSideTeam) {
			throw createNotFoundError('Team', { fields });
		}

		const game = await db.select()
			.from(gameTable)
			.where(
				eq(gameTable.gameId, gameId),
			)
			.then(maybeSingle);

		let gameDetails;
		if (!game) {
			const { insertedGame, insertedPlayerDetails, insertedTeamDetails } = await fetchGame(gameId, context.tournament.region, blueSideTeam.teamId, redSideTeam.teamId);
			gameDetails = transformToGame(insertedGame, insertedPlayerDetails, insertedTeamDetails);
		}
		else {
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

			gameDetails = transformToGame(game, playerDetails, teamDetails);
		}

		await db.insert(gameMatchupRelationTable)
			.values({
				matchupId: context.matchup.matchupId,
				gameId: gameDetails.gameId,
			});

		return gameDetails;
	}),
});

async function fetchGame(gameId: string, region: LolRegion, blueSideTeamId: number, redSideTeamId: number) {
	let gameData;
	try {
		gameData = (await riotFetch(`/lol/match/v5/matches/${gameId}`, {
			region: regionToCluster(region),
		})).data;
	}
	catch (e) {
		if (e instanceof RiotError) {
			if (e.statusCode == 404) {
				throw createNotFoundError('Match');
			}
		}
		throw e;
	}

	const { metadata, info } = gameData;

	const { insertedGame, insertedPlayerDetails, insertedTeamDetails } = await db.transaction(async (tx) => {
		const insertedGame = await tx.insert(gameTable)
			.values({
				gameId: metadata.matchId,
				gameStart: new Date(info.gameStartTimestamp),
				gameDuration: info.gameDuration,
			})
			.returning()
			.then(single);

		type InsertPlayer = typeof gamePlayerDetailsTable.$inferInsert;
		const playerStats: InsertPlayer[] = [];

		const blueSide = {
			assists: 0,
			deaths: 0,
		};

		const redSide = {
			assists: 0,
			deaths: 0,
		};

		for (const participant of info.participants) {
			const side = teamIdToSide(participant.teamId);
			let team = null;

			switch (side) {
				case 'BLUE':
					team = blueSide;
					break;
				case 'RED':
					team = redSide;
					break;
			}

			team.assists += participant.assists;
			team.deaths += participant.deaths;

			playerStats.push({
				puuid: participant.puuid,
				gameId: metadata.matchId,
				champId: participant.championId,
				position: participant.teamPosition,
				participantId: participant.participantId,
				side: side,
				item0: participant.item0,
				item1: participant.item1,
				item2: participant.item2,
				item3: participant.item3,
				item4: participant.item4,
				item5: participant.item5,
				item6: participant.item6,
				...translateRiotPerks(participant.perks),
				summoner1Id: participant.summoner1Id,
				summoner2Id: participant.summoner2Id,
				win: participant.win,
				champLevel: participant.champLevel,
				kills: participant.kills,
				assists: participant.assists,
				deaths: participant.deaths,
				doubleKills: participant.doubleKills,
				tripleKills: participant.tripleKills,
				quadraKills: participant.quadraKills,
				pentaKills: participant.pentaKills,
				firstBloodKill: participant.firstBloodKill,
				firstTowerKill: participant.firstTowerKill,
				totalEnemyJungleMinionKills: participant.totalEnemyJungleMinionsKilled,
				totalMinionKills: participant.totalMinionsKilled,
				turretKills: participant.turretKills,
				ccScore: participant.timeCCingOthers,
				objectivesStolen: participant.objectivesStolen,
				goldEarned: participant.goldEarned,
				damageToTurrets: participant.damageDealtToTurrets,
				totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
				magicDamageDealtToChampions: participant.magicDamageDealtToChampions,
				physicalDamageDealtToChampions: participant.physicalDamageDealtToChampions,
				trueDamageDealtToChampions: participant.trueDamageDealtToChampions,
				totalDamageTaken: participant.totalDamageTaken,
				phyiscalDamageTaken: participant.physicalDamageTaken,
				magicalDamageTaken: participant.magicDamageTaken,
				trueDamageTaken: participant.trueDamageTaken,
				damageSelfMitigated: participant.damageSelfMitigated,
				totalHealingDone: participant.totalHeal,
				totalAllyHealing: participant.totalHealsOnTeammates,
				totalDamageShielded: participant.totalDamageShieldedOnTeammates,
			});
		}

		const { createdAt: gamePlayerDetailsTableCreatedAt, ...gamePlayerDetailsRest } = getTableColumns(gamePlayerDetailsTable);

		const insertedPlayerDetails = await tx.insert(gamePlayerDetailsTable)
			.values(playerStats)
			.returning(gamePlayerDetailsRest);

		type InsertTeam = typeof gameTeamDetailsTable.$inferInsert;
		const teamStats: InsertTeam[] = [];

		for (const team of info.teams) {
			const side = teamIdToSide(team.teamId);

			let accumulated = null;

			switch (side) {
				case 'BLUE':
					accumulated = blueSide;
					break;
				case 'RED':
					accumulated = redSide;
					break;
			}

			teamStats.push({
				gameId: metadata.matchId,
				side: side,
				teamId: side == 'BLUE' ? blueSideTeamId : redSideTeamId,
				bans: team.bans.map(ban => ban.championId),
				win: team.win,
				atakhanKills: team.objectives.atakhan?.kills,
				baronKills: team.objectives.baron.kills,
				dragonKills: team.objectives.dragon.kills,
				riftHeraldKills: team.objectives.riftHerald.kills,
				grubsKills: team.objectives.horde?.kills,
				inhibitorKills: team.objectives.inhibitor.kills,
				towerKills: team.objectives.tower.kills,
				featEpicMonsterKill: team.feats?.EPIC_MONSTER_KILL?.featState == 3,
				featFirstBlood: team.feats?.FIRST_BLOOD?.featState == 3,
				featFirstTurret: team.feats?.FIRST_TURRET?.featState == 1,
				kills: team.objectives.champion.kills,
				assists: accumulated.assists,
				deaths: accumulated.deaths,
			});
		}

		const insertedTeamDetailsCTE = tx.$with('inserted_team_details').as(
			tx.insert(gameTeamDetailsTable)
				.values(teamStats)
				.returning(),
		);

		// this uses private api, may break in the future but works for now
		const {
			createdAt: insertedTeamDetailsCTECreatedAt,
			teamId: insertedTeamDetailsCTETeamId,
			...insertedTeamDetailsCTERest
		} = insertedTeamDetailsCTE._.selectedFields;

		const insertedTeamDetails = await tx.with(insertedTeamDetailsCTE).select({
			...insertedTeamDetailsCTERest,
			teamId: teamTable.shortId,
		})
			.from(insertedTeamDetailsCTE)
			.innerJoin(teamTable, eq(teamTable.teamId, insertedTeamDetailsCTE.teamId));

		return { insertedGame, insertedPlayerDetails, insertedTeamDetails };
	});
	return { insertedGame, insertedPlayerDetails, insertedTeamDetails };
}

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

function teamIdToSide(teamId: number): Side {
	return teamId == 100 ? 'BLUE' : 'RED';
}

interface Runes {
	capstoneRuneId: number;
	primaryRune1Id: number;
	primaryRune2Id: number;
	primaryRune3Id: number;
	subRune1Id: number;
	subRune2Id: number;
}

type RiotPerks = components['schemas']['match-v5.PerksDto'];

function translateRiotPerks(riotPerks: RiotPerks): Runes {
	const runes: Partial<Runes> = {};
	for (const style of riotPerks.styles) {
		const selections = style.selections;
		if (style.description == 'primaryStyle') {
			runes.capstoneRuneId = selections[0]!.perk;
			runes.primaryRune1Id = selections[1]!.perk;
			runes.primaryRune2Id = selections[2]!.perk;
			runes.primaryRune3Id = selections[3]!.perk;
		}
		if (style.description == 'subStyle') {
			runes.subRune1Id = selections[0]!.perk;
			runes.subRune2Id = selections[0]!.perk;
		}
	}
	return runes as Runes;
}
