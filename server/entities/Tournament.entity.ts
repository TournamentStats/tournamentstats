import { Entity, Enum, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Region } from './common';
import { SupabaseUser } from './SupabaseUser.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Tournament extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	tournamentId!: number & Opt;

	@Property({ type: 'string' })
	shortId!: string & Opt;

	@Property({ type: 'string' })
	name!: string;

	@ManyToOne(() => SupabaseUser)
	owner!: SupabaseUser;

	@Property({
		type: 'date',
		nullable: true,
	})
	startDate?: Date;

	@Property({
		type: 'date',
		nullable: true,
	})
	endDate?: Date;

	@Property({ type: 'boolean' })
	isPrivate!: boolean;

	@Enum({
		items: () => Region,
		nativeEnumName: 'region',
	})
	region!: Region;
}

export { Region } from './common';
