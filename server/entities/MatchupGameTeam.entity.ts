import { Entity, Enum, ManyToOne, PrimaryKeyProp } from '@mikro-orm/core';
import { MatchupGame } from './MatchupGame.entity';
import { MatchupTeam } from './MatchupTeam.entity';
import { Side } from './common';
import { BaseEntity } from './base.entity';

@Entity()
export class MatchupGameTeam extends BaseEntity {
	[PrimaryKeyProp]?: ['game', 'side'];

	@ManyToOne({
		primary: true,
		entity: () => MatchupGame,
	})
	game!: MatchupGame;

	@Enum({
		items: () => Side,
		primary: true,
		nativeEnumName: 'side',
	})
	side!: Side;

	@ManyToOne(() => MatchupTeam)
	team!: MatchupTeam;
}
