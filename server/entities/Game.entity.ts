import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity()
export class Game extends BaseEntity {
	@PrimaryKey({ type: 'string' })
	gameId!: string;

	@Property({
		type: 'number',
		nullable: true,
	})
	gameDuration?: number;

	@Property({ type: 'Date' })
	gameStart!: Date;
}
