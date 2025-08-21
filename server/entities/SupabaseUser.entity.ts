import { Entity, OneToMany, PrimaryKey, type Collection } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import type { UUID } from 'crypto';
import { Tournament } from './Tournament.entity';
import { Team } from './Team.entity';

@Entity({
	tableName: 'auth.users',
	schema: 'auth',
})
export class SupabaseUser extends BaseEntity {
	@PrimaryKey({ type: 'uuid' })
	id!: UUID;

	@OneToMany({
		entity: () => Tournament,
		mappedBy: 'tournamentId',
	})
	tournaments!: Collection<Tournament>;

	@OneToMany({
		entity: () => Team,
		mappedBy: 'teamId',
	})
	teams!: Collection<Team>;
}
