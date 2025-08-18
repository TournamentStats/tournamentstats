import type { User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';

export function isOwner(user: User) {
	return eq(tournamentTable.ownerId, user.id);
}
