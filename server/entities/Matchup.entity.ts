import { Entity, Enum, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Tournament } from './Tournament.entity';
import { Format } from './common';
import { BaseEntity } from './base.entity';

@Entity()
export class Matchup extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	matchupId!: number & Opt;

	@Property({ type: 'string' })
	shortId!: string & Opt;

	@ManyToOne(() => Tournament)
	tournament!: Tournament;

	@Enum({
		items: () => Format,
		nativeEnumName: 'format',
		nullable: true,
	})
	format?: Format;
}

export { Format } from './common';
