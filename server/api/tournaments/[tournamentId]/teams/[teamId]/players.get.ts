import * as z from 'zod/v4';

import { and, eq } from 'drizzle-orm';

const PathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await getUser(event);
		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));

		let selectedPlayers = await db.select({
			puuid: player.puuid,
			name: tournamentParticipant.name,
			gameName: player.gameName,
			tagLine: player.tagLine,
			region: player.region,
		})
			.from(tournament)
			.innerJoin(team, eq(team.tournamentId, tournament.tournamentId))
			.leftJoin(tournamentParticipant, and(
				eq(tournamentParticipant.tournamentId, tournament.tournamentId),
				eq(tournamentParticipant.teamId, team.teamId),
			))
			.leftJoin(player, eq(player.puuid, tournamentParticipant.puuid))
			.where(
				and(
					eq(tournament.shortId, tournamentId),
					eq(team.shortId, teamId),
					hasTournamentViewPermissions(user),
				),
			);

		if (selectedPlayers.length === 0) {
			// we have no matching tournament + team combination
			throw createNotFoundError('Team', 'in the specified tournament');
		}

		if (selectedPlayers[0]!.puuid == null) {
			// our left join resulted in zero matching participants
			selectedPlayers = [];
		}

		return selectedPlayers;
	}),
});
