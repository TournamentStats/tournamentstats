import * as z from 'zod/v4';

import { getTableColumns } from 'drizzle-orm';

const RequestBody = z.object({
	name: z.string().min(3).max(32),
	isPrivate: z.boolean(),
	imageId: z.string().optional(),
	region: z.enum(regions),
});

export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: withErrorHandling(async (event) => {
		const user = await requireAuthorization(event);

		const { name, isPrivate, imageId, region } = await readValidatedBody(event, data => RequestBody.parse(data));

		const insertedTournament = await db.transaction(async (tx) => {
			const { shortId, createdAt, ...rest } = getTableColumns(tournament);

			const insertedTournament = await tx.insert(tournament)
				.values({
					name,
					isPrivate,
					ownerId: user.id,
					region,
				})
				.returning({ ...rest, id: tournament.shortId })
				.then(single);

			let imageUrl = null;
			if (imageId) {
				imageUrl = (await moveTournamentImage(event, imageId, insertedTournament.id)).signedUrl;
			}

			return {
				...insertedTournament,
				imageUrl,
			};
		});

		return insertedTournament;
	}),
});
