import { Entity, Enum, ManyToOne, PrimaryKeyProp } from '@mikro-orm/core';
import { MatchupGame } from './MatchupGame.entity';
import { MatchupTeamParticipation } from './MatchupTeamParticipation.entity';
import { Side } from './common';
import { BaseEntity } from './base.entity';

@Entity()
export class MatchupGameTeamParticipation extends BaseEntity {
	[PrimaryKeyProp]?: ['matchupGame', 'side'];

	@ManyToOne({
		primary: true,
		entity: () => MatchupGame,
		// manually overwrite because 2 keys exists, inconsistent else
		columnTypes: ['integer', 'text'],
		joinColumns: ['matchup_id', 'game_id'],
		referencedColumnNames: ['matchup_id', 'game_id'],
	})
	matchupGame!: MatchupGame;

	@Enum({
		items: () => Side,
		primary: true,
		nativeEnumName: 'side',
	})
	side!: Side;

	@ManyToOne({
		entity: () => MatchupTeamParticipation,
		// manually overwrite because 2 keys exists, inconsistent else
		columnTypes: ['integer', 'integer'],
		joinColumns: ['matchup_id', 'team_id'],
		referencedColumnNames: ['matchup_id', 'team_id'],
	})
	team!: MatchupTeamParticipation;
}
