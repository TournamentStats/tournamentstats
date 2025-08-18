import type { User } from '@supabase/supabase-js';
import { eq, or, and } from 'drizzle-orm';

import { isOwner } from './isOwner';

export function hasTournamentViewPermissions(user: User | null) {
	const filters = [
		eq(tournamentTable.isPrivate, false),
	];

	if (user) {
		filters.push(isOwner(user));
	}

	return or(...filters);
}

export async function checkTournamentViewPermission(user: User, tournamentId: string): Promise<boolean> {
	const res = await db
		.select()
		.from(tournamentTable)
		.where(and(eq(tournamentTable.shortId, tournamentId), hasTournamentViewPermissions(user)))
		.limit(1);
	return res.length > 0;
}

export function hasTournamentDeletePermissions(user: User) {
	return isOwner(user);
}

export async function checkTournamentDeletePermission(user: User, tournamentId: string): Promise<boolean> {
	const res = await db
		.select()
		.from(tournamentTable)
		.where(and(eq(tournamentTable.shortId, tournamentId), hasTournamentDeletePermissions(user)))
		.limit(1);
	return res.length > 0;
};

export function hasTournamentModifyPermissions(user: User) {
	return isOwner(user);
}

export async function checkTournamentModifyPermission(user: User, tournamentId: string): Promise<boolean> {
	const res = await db
		.select()
		.from(tournamentTable)
		.where(and(eq(tournamentTable.shortId, tournamentId), hasTournamentModifyPermissions(user)))
		.limit(1);
	return res.length > 0;
}
