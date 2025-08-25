import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';
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
		mappedBy: 'owner',
	})
	tournaments = new Collection<Tournament>(this);

	@OneToMany({
		entity: () => Team,
		mappedBy: 'owner',
	})
	teams = new Collection<Team>(this);
}
