import { Entity, ManyToOne, PrimaryKeyProp } from '@mikro-orm/core';
import type { Team } from './Team.entity';
import type { Tournament } from './Tournament.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class TournamentTeamParticipation extends BaseEntity {
	[PrimaryKeyProp]?: ['team_id', 'tournament_id'];

	@ManyToOne({
		entity: 'Team',
		primary: true,
		joinColumn: 'team_id',
		referenceColumnName: 'team_id',
	})
	team!: Team;

	@ManyToOne({
		entity: 'Tournament',
		primary: true,
		joinColumn: 'tournament_id',
		referenceColumnName: 'tournament_id',
	})
	tournament!: Tournament;
}
