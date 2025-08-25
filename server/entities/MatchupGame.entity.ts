import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Unique } from '@mikro-orm/core';
import type { Game } from './Game.entity';
import type { Matchup } from './Matchup.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Unique({ properties: ['matchup', 'game'] })
export class MatchupGame extends BaseEntity {
	[PrimaryKeyProp]?: ['matchup', 'ordering'];

	@ManyToOne({
		entity: 'Matchup',
		primary: true,
		joinColumn: 'matchup_id',
		referenceColumnName: 'matchup_id',
	})
	matchup!: Matchup;

	@PrimaryKey({ type: 'number' })
	ordering!: number;

	@ManyToOne({
		entity: 'Game',
		joinColumn: 'game_id',
		referenceColumnName: 'game_id',
	})
	game!: Game;
}
