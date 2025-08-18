import { and, eq, getTableColumns } from 'drizzle-orm';
import * as z from 'zod/v4';

const PathParams = z.object({
	tournamentId: z.string().min(1),
	teamId: z.string().min(1),
});

const RequestBody = z.object({
	name: z.string().min(3).max(32),
	abbreviation: z.string().min(1).max(5).optional(),
	imageId: z.string().optional(),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);
		const { tournamentId, teamId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { name, abbreviation, imageId } = await readValidatedBody(event, obj => RequestBody.parse(obj));

		const updatedTeam = await db.transaction(async (tx) => {
			const { shortId, createdAt, ...rest } = getTableColumns(teamTable);
			const updatedTeam = await tx.update(teamTable)
				.set({ name, abbreviation })
				.from(tournamentTable)
				.where(
					and(
						eq(teamTable.tournamentId, tournamentTable.tournamentId),
						eq(tournamentTable.shortId, tournamentId),
						eq(teamTable.shortId, teamId),
						hasTournamentModifyPermissions(user),
					),
				)
				.returning({
					...rest,
					teamId: teamTable.shortId,
					tournamentId: tournamentTable.shortId,
				})
				.then(maybeSingle);

			if (!updatedTeam) {
				throw createNotFoundError('Team');
			}

			let imageUrl = null;
			if (imageId) {
				imageUrl = (await moveTeamImage(event, imageId, tournamentId, teamId)).signedUrl;
			}

			return {
				...updatedTeam,
				imageUrl,
			};
		});

		return updatedTeam;
	}),
});
