import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp } from '@mikro-orm/core';
import { Game } from './Game.entity';
import { Matchup } from './Matchup.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class MatchupGame extends BaseEntity {
	[PrimaryKeyProp]?: ['matchup', 'ordering'];

	@ManyToOne(() => Game)
	game!: Game;

	@ManyToOne({
		entity: () => Matchup,
		primary: true,
	})
	matchup!: Matchup;

	@PrimaryKey({ type: 'number' })
	ordering!: number;
}
