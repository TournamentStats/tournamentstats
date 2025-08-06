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
		const { shortId, createdAt, ...rest } = getTableColumns(team);
		let selectedTeams = await db.select({
			...rest,
			teamId: team.shortId,
			tournamentId: tournament.shortId,
		})
			.from(tournament)
			.leftJoin(team, eq(team.tournamentId, tournament.tournamentId))
			.where(
				and(
					eq(tournament.shortId, tournamentId),
					hasTournamentViewPermissions(user),
				),
			);

		if (selectedTeams.length === 0) {
			// couldn't find a tournament at all
			throw createNotFoundError('Tournament');
		}

		if (selectedTeams[0]!.teamId == null) {
			// our left join resulted in zero matching teams
			selectedTeams = [];
		}

		const teamsWithImages = await Promise.all(
			selectedTeams.map(async t => ({
				...t,
				imageUrl: await getSignedTeamImage(event, t.tournamentId, t.teamId!),
			})),
		);

		return teamsWithImages;
	}),
});
