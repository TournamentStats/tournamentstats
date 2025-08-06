import * as z from 'zod/v4';

import { and, eq, sql } from 'drizzle-orm';

const PathParams = z.object({
	tournamentId: z.string().min(1),
});

const RequestBody = z.object({
	name: z.string().min(3).max(32),
	shorthand: z.string().min(1).max(5).optional(),
	imageId: z.string().optional(),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);
		const { tournamentId } = await getValidatedRouterParams(event, obj => PathParams.parse(obj));
		const { name, shorthand, imageId } = await readValidatedBody(event, obj => RequestBody.parse(obj));

		const createdTeam = await db.transaction(async (tx) => {
			// use cte to insert tournamentId from tournament table with permission check
			// all in one query
			const insertedTeamCTE = tx.$with('inserted_team').as(
				tx.insert(team)
					.select(
						tx.select({
							tournamentId: tournament.tournamentId,
							name: sql<string>`${name}`.as('name'),
							shorthand: sql<string | null>`${shorthand ?? null}`.as('shorthand'),
						})
							.from(tournament)
							.where(
								and(
									eq(tournament.shortId, tournamentId),
									hasTournamentModifyPermissions(user),
								),
							),
					)
					.returning(),
			);
			// use cte to join tournament for short id
			const createdTeam = await tx.with(insertedTeamCTE)
				.select({
					teamId: insertedTeamCTE.shortId,
					tournamentId: tournament.shortId,
					name: insertedTeamCTE.name,
					shorthand: insertedTeamCTE.abbreviation,
				})
				.from(insertedTeamCTE)
				.innerJoin(tournament, eq(insertedTeamCTE.tournamentId, tournament.tournamentId))
				.then(maybeSingle);

			// if no team was created, either tournament didn't exist or user did not
			// have modify permissions
			if (!createdTeam) {
				throw createNotFoundError('Tournament');
			}

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
