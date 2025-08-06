import { and, eq, getTableColumns } from 'drizzle-orm';
import * as z from 'zod/v4';

const PathParams = z.object({
	tournamentId: z.string().min(1),
});

const RequestBody = z.object({
	name: z.string().min(3).max(32).optional(),
	isPrivate: z.boolean().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	imageId: z.string().optional(),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { name, isPrivate, startDate, endDate, imageId } = await readValidatedBody(event, obj => RequestBody.parse(obj));

		const { shortId, createdAt, ...rest } = getTableColumns(tournament);
		const updatedTournament = await db.transaction(async (tx) => {
			const updatedTournament = await tx.update(tournament)
				.set({
					name,
					isPrivate,
					startDate: startDate?.toUTCString(),
					endDate: endDate?.toUTCString(),
				})
				.where(
					and(
						eq(tournament.shortId, tournamentId),
						hasTournamentModifyPermissions(user),
					),
				)
				.returning({
					...rest,
					tournamentId: tournament.shortId,
				})
				.then(maybeSingle);

			if (!updatedTournament) {
				throw createNotFoundError('Tournament');
			}

			let imageUrl = null;
			if (imageId) {
				imageUrl = (await moveTournamentImage(event, imageId, updatedTournament.tournamentId)).signedUrl;
			}

			return {
				...updatedTournament,
				imageUrl,
			};
		});
		return updatedTournament;
	}),
});
