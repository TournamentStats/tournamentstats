import type { User } from '@supabase/supabase-js'
import { and, eq, or } from 'drizzle-orm'

export function maybeSingle<T>(values: T[]): T | undefined {
	if (values.length > 1) throw new Error('Found non unique value')
	if (values.length == 1) {
		return values[0]
	}
	return undefined
}

export function single<T>(values: T[]): T {
	if (values.length != 1) throw new Error('Found non unique or inexistent value')
	return values[0] as T
}

export function isOwner(user: User) {
	return eq(tournament.ownerId, user.id)
}

export function hasTournamentViewPermissions(user: User | null) {
	const filters = [
		eq(tournament.isPrivate, false),
	]

	if (user) {
		filters.push(isOwner(user))
	}

	return or(...filters)
}

export async function checkTournamentViewPermission(user: User, tournamentId: string): Promise<boolean> {
	const res = await db
		.select()
		.from(tournament)
		.where(and(eq(tournament.shortId, tournamentId), hasTournamentViewPermissions(user)))
		.limit(1)
	return res.length > 0
}

export function hasTournamentDeletePermissions(user: User) {
	return isOwner(user)
}

export async function checkTournamentDeletePermission(user: User, tournamentId: string): Promise<boolean> {
	const res = await db
		.select()
		.from(tournament)
		.where(and(eq(tournament.shortId, tournamentId), hasTournamentDeletePermissions(user)))
		.limit(1)
	return res.length > 0
}

export function hasTournamentModifyPermissions(user: User) {
	return isOwner(user)
}

export async function checkTournamentModifyPermission(user: User, tournamentId: string): Promise<boolean> {
	const res = await db
		.select()
		.from(tournament)
		.where(and(eq(tournament.shortId, tournamentId), hasTournamentModifyPermissions(user)))
		.limit(1)
	return res.length > 0
}
