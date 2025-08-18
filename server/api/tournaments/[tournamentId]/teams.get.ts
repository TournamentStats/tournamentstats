import { and, eq, getTableColumns } from 'drizzle-orm';
import * as z from 'zod/v4';

const PathParams = z.object({
	tournamentId: z.string().min(1),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = event.context.auth.user;
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { shortId, createdAt, ...rest } = getTableColumns(teamTable);
		let result = await db.select({
			...rest,
			teamId: teamTable.shortId,
			tournamentId: tournamentTable.shortId,
		})
			.from(tournamentTable)
			.leftJoin(teamTable, eq(teamTable.tournamentId, tournamentTable.tournamentId))
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					hasTournamentViewPermissions(user),
				),
			);

		if (result.length === 0) {
			// couldn't find a tournament at all
			throw createNotFoundError('Tournament');
		}

		if (result[0]!.teamId == null) {
			// our left join resulted in zero matching teams
			result = [];
		}

		const teamsWithImages = await Promise.all(
			result.map(async row => ({
				teamId: row.teamId,
				name: row.name,
				abbrevation: row.abbreviation,
				imageUrl: await getSignedTeamImage(event, row.tournamentId, row.teamId!),
			})),
		);

		return teamsWithImages;
	}),
});
