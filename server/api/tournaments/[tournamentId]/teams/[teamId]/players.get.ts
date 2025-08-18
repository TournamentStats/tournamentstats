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

		let result = await db.select({
			puuid: playerTable.puuid,
			name: tournamentParticipantTable.name,
			gameName: playerTable.gameName,
			tagLine: playerTable.tagLine,
			region: playerTable.region,
		})
			.from(tournamentTable)
			.innerJoin(teamTable, eq(teamTable.tournamentId, tournamentTable.tournamentId))
			.leftJoin(tournamentParticipantTable, and(
				eq(tournamentParticipantTable.tournamentId, tournamentTable.tournamentId),
				eq(tournamentParticipantTable.teamId, teamTable.teamId),
			))
			.leftJoin(playerTable, eq(playerTable.puuid, tournamentParticipantTable.puuid))
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					eq(teamTable.shortId, teamId),
					hasTournamentViewPermissions(user),
				),
			);

		if (result.length === 0) {
			// we have no matching tournament + team combination
			throw createNotFoundError('Team', 'in the specified tournament');
		}

		if (result[0]!.puuid == null) {
			// our left join resulted in zero matching participants
			result = [];
		}

		return result;
	}),
});
