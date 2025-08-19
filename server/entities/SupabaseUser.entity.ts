import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import type { UUID } from 'crypto';

@Entity({
	tableName: 'auth.users',
	schema: 'auth',
})
export class SupabaseUser extends BaseEntity {
	@PrimaryKey({ type: 'uuid' })
	id!: UUID;

	@Property({ type: 'string' })
	email!: string;
}
