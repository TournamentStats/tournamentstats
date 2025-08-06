import { getTableColumns } from 'drizzle-orm';
import { getSignedTournamentImage } from '~~/server/utils/supabase/images';
import { withErrorHandling } from '~~/server/utils/errors';

defineRouteMeta({
	openAPI: {
		tags: ['tournament'],
		description: 'Gets all Tournaments the authenticated user can see, that means public tournaments and tournaments the user is invited to.',
		security: [{ authentication: [] }],
	},
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = event.context.auth.user;

		// remove shortId and createdAt from result
		// assign tournamentId our short id alias
		const { shortId, createdAt, ...rest } = getTableColumns(tournament);
		const selectedTournaments = await db.select({
			...rest,
			tournamentId: tournament.shortId,
		})
			.from(tournament)
			.where(
				hasTournamentViewPermissions(user),
			);

		const tournamentsWithImages = await Promise.all(
			selectedTournaments.map(async t => ({
				...t,
				imageUrl: await getSignedTournamentImage(event, t.tournamentId),
			})),
		);
		return tournamentsWithImages;
	}),
});
