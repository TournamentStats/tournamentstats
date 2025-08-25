import { Entity, OneToMany, PrimaryKey, Property, type Collection } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { GamePlayerDetails } from './GamePlayerDetails.entity';
import { GameTeamDetails } from './GameTeamDetails.entity';

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

	@OneToMany({
		entity: () => GamePlayerDetails,
		mappedBy: 'game',
	})
	playerDetails = new Collection<GamePlayerDetails>(this);

	@OneToMany({
		entity: () => GameTeamDetails,
		mappedBy: 'game',
	})
	teamDetails = new Collection<GameTeamDetails>(this);
}
