import { eq, and } from 'drizzle-orm';
import * as z from 'zod/v4';

import { hasTournamentDeletePermissions } from '~~/server/utils/drizzle/utils';

const PathParams = z.object({
	tournamentId: z.string().min(1),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const deletedTournament = await db.delete(tournamentTable)
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					hasTournamentDeletePermissions(user),
				),
			)
			.returning({ shortId: tournamentTable.shortId })
			.then(maybeSingle);

		if (!deletedTournament) {
			throw createNotFoundError('Tournament');
		}

		// theoretical we can return here and execute the deletion in the background
		sendNoContent(event);

		// fire and forget image deletion
		void deleteTournamentImages(event, deletedTournament.shortId);
	}),
});
