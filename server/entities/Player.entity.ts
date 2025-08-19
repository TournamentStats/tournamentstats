import { Entity, Enum, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Region } from './common';
import { BaseEntity } from './base.entity';

@Entity()
export class Player extends BaseEntity {
	@PrimaryKey({ type: 'string' })
	puuid!: string;

	@Property({ type: 'date' })
	lastUpdated!: Date & Opt;

	@Property({ type: 'number' })
	profileIconId!: number;

	@Property({ type: 'string' })
	gameName!: string;

	@Property({ type: 'string' })
	tagLine!: string;

	@Enum({
		items: () => Region,
		nativeEnumName: 'region',
	})
	region!: Region;
}

export { Region } from './common';
