import { Entity, ManyToOne, type Opt,	PrimaryKey,	Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { SupabaseUser } from './SupabaseUser.entity';

@Entity()
export class Team extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	teamId!: number & Opt;

	@Property({ type: 'string' })
	shortId!: string & Opt;

	@ManyToOne({
		entity: () => SupabaseUser,
		inversedBy: 'teams',
	})
	owner!: SupabaseUser;

	@Property({ type: 'string' })
	teamName!: string;

	@Property({
		type: 'string',
		nullable: true,
	})
	abbreviation?: string;

	@Property({ type: 'boolean' })
	isPrivate!: boolean;
}
