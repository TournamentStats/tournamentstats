import * as z from 'zod/v4';

import { and, eq, getTableColumns } from 'drizzle-orm';

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

		const { shortId, createdAt, ...rest } = getTableColumns(tournamentTable);
		const selectedTournament = await db.select({
			...rest,
			tournamentId: tournamentTable.shortId,
		})
			.from(tournamentTable)
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					hasTournamentViewPermissions(user),
				),
			)
			.then(maybeSingle);

		if (!selectedTournament) {
			throw createNotFoundError('Tournament');
		}

		const imageUrl = await getSignedTournamentImage(event, selectedTournament.tournamentId);

		return {
			...selectedTournament,
			imageUrl,
		};
	}),
});
