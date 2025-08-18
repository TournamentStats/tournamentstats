import * as z from 'zod/v4';

import { and, eq } from 'drizzle-orm';

const PathParams = z.object({
	tournamentId: z.string().min(1),
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
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { name, abbreviation, imageId } = await readValidatedBody(event, obj => RequestBody.parse(obj));

		const context = await db.select({
			tournamentId: tournamentTable.tournamentId,
		})
			.from(tournamentTable)
			.where(
				and(
					eq(tournamentTable.shortId, tournamentId),
					hasTournamentModifyPermissions(user),
				),
			)
			.then(maybeSingle);

		if (!context) {
			throw createNotFoundError('Tournament');
		}

		const createdTeam = await db.transaction(async (tx) => {
			// use cte to insert tournamentId
			const insertedTeamCTE = tx.$with('inserted_team').as(
				tx.insert(teamTable)
					.values({
						tournamentId: context.tournamentId,
						name,
						abbreviation,
					})
					.returning(),
			);
			// use cte to join tournament for short id
			const createdTeam = await tx.with(insertedTeamCTE)
				.select({
					teamId: insertedTeamCTE.shortId,
					tournamentId: tournamentTable.shortId,
					name: insertedTeamCTE.name,
					shorthand: insertedTeamCTE.abbreviation,
				})
				.from(insertedTeamCTE)
				.innerJoin(tournamentTable, eq(insertedTeamCTE.tournamentId, tournamentTable.tournamentId))
				.then(single);

			let imageUrl = null;
			if (imageId) {
				imageUrl = (await moveTeamImage(event, imageId, createdTeam.tournamentId, createdTeam.teamId)).signedUrl;
			}

			return {
				...createdTeam,
				imageUrl,
			};
		});

		return createdTeam;
	}),
});
