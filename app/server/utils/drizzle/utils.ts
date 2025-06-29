import type { User } from '@supabase/supabase-js'
import { eq, or } from 'drizzle-orm'

export function maybeSingle<T>(values: T[]): T | undefined {
	if (values.length > 1) throw new Error('Found non unique value')
	if (values.length == 1) {
		return values[0]
	}
	return undefined
}

export function single<T>(values: T[]): T {
	if (values.length != 1) throw new Error('Found non unique or inexistent value')
	return values[0]
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

export function hasTournamentDeletePermissions(user: User) {
	return isOwner(user)
}

export function hasTournamentModifyPermissions(user: User) {
	return isOwner(user)
}
