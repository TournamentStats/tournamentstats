import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp } from '@mikro-orm/core';
import { Game } from './Game.entity';
import { Matchup } from './Matchup.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class MatchupGame extends BaseEntity {
	[PrimaryKeyProp]?: ['matchup', 'ordering'];

	@ManyToOne({
		entity: () => Matchup,
		primary: true,
		inversedBy: 'games',
	})
	matchup!: Matchup;

	@PrimaryKey({ type: 'number' })
	ordering!: number;

	// don't need inverse mapping here
	@ManyToOne(() => Game)
	game!: Game;
}
