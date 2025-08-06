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
			filterArray.push(eq(team.shortId, filters.team));
		}

		if (filters.position) {
			eq(tournamentParticipant.teamPosition, filters.position);
		}

		let selectedParticipants = await db.select({
			puuid: player.puuid,
			gameName: player.gameName,
			tagLine: player.tagLine,
			profileIconId: player.profileIconId,
			name: tournamentParticipant.name,
			teamPosition: tournamentParticipant.teamPosition,
			team: {
				teamId: team.shortId,
				abbreviation: team.abbreviation,
				teamName: team.name,
			},
		})
			.from(tournament)
			.leftJoin(tournamentParticipant, eq(tournamentParticipant.tournamentId, tournament.tournamentId))
			.leftJoin(player, eq(player.puuid, tournamentParticipant.puuid))
			.leftJoin(team, eq(team.teamId, tournamentParticipant.teamId))
			.where(
				and(
					eq(tournament.shortId, tournamentId),
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
