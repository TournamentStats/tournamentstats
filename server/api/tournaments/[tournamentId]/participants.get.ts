import { z } from 'zod/v4';

import { eq, and } from 'drizzle-orm';

const PathParams = z.object({
	tournamentId: z.string().min(1),
});

const QueryParams = z.object({
	team: z.string().optional(),
	position: z.enum(lolPositions).optional(),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await getUser(event);
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));

		const filters = await getValidatedQuery(event, obj => QueryParams.parse(obj));

		const filterArray = [];

		if (filters.team) {
			filterArray.push(eq(teamTable.shortId, filters.team));
		}

		if (filters.position) {
			filterArray.push(eq(tournamentParticipantTable.teamPosition, filters.position));
		}

		let selectedParticipants = await db.select({
			puuid: playerTable.puuid,
			gameName: playerTable.gameName,
			tagLine: playerTable.tagLine,
			profileIconId: playerTable.profileIconId,
			name: tournamentParticipantTable.name,
			teamPosition: tournamentParticipantTable.teamPosition,
			team: {
				teamId: teamTable.shortId,
				abbreviation: teamTable.abbreviation,
				teamName: teamTable.name,
			},
		})
			.from(tournamentTable)
			.leftJoin(tournamentParticipantTable, eq(tournamentParticipantTable.tournamentId, tournamentTable.tournamentId))
			.leftJoin(playerTable, eq(playerTable.puuid, tournamentParticipantTable.puuid))
			.leftJoin(teamTable, eq(teamTable.teamId, tournamentParticipantTable.teamId))
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					hasTournamentViewPermissions(user),
					...filterArray,
				),
			);

		if (selectedParticipants.length == 0) {
			throw createNotFoundError('Tournament');
		}

		if (selectedParticipants[0]!.puuid == null) {
			selectedParticipants = [];
		}

		const selectedParticipantsWithTeamImages = await Promise.all(
			selectedParticipants.map(async (participant) => {
				return {
					...participant,
					team: {
						...(participant.team),
						imageUrl: await getSignedTeamImage(event, tournamentId, participant.team!.teamId),
					},
				};
			}),
		);

		return selectedParticipantsWithTeamImages;
	}),
});
