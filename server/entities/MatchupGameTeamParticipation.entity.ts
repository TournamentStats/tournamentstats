import { Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyProp } from '@mikro-orm/core';
import { MatchupGame } from './MatchupGame.entity';
import { MatchupTeamParticipation } from './MatchupTeamParticipation.entity';
import { Side } from './common';
import { BaseEntity } from './base.entity';
import type { Matchup } from './Matchup.entity';

@Entity()
export class MatchupGameTeamParticipation extends BaseEntity {
	[PrimaryKeyProp]?: ['matchup', 'game', 'side'];

	@PrimaryKey({ type: 'matchup' })
	matchup!: Matchup;

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

	@ManyToOne({
		entity: () => MatchupTeamParticipation,
		inversedBy: 'games',
	})
	team!: MatchupTeamParticipation;
}
