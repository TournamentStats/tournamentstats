import { BaseEntity, Entity, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import { Matchup } from './Matchup.entity';
import type { Tournament } from './Tournament.entity';
import { TournamentTeamParticipation } from './TournamentTeamParticipation.entity';
import type { Team } from './Team.entity';

@Entity()
@Unique({ properties: ['matchup', 'team'] })
export class MatchupTeamParticipation extends BaseEntity {
	[PrimaryKeyProp]?: ['matchup', 'team'];

	@ManyToOne({
		entity: () => Matchup,
		primary: true,
		joinColumns: ['tournament_id', 'matchup_id'],
		referencedColumnNames: ['tournament_id', 'matchup_id'],
	})
	matchup!: Matchup;

	@ManyToOne({
		entity: () => TournamentTeamParticipation,
		primary: true,
		joinColumns: ['tournament_id', 'team_id'],
		referencedColumnNames: ['tournament_id', 'team_id'],
	})
	teamParticipation!: TournamentTeamParticipation;

	@Property({ type: 'number' })
	ordering!: number;

	// dont know if allowed
	@ManyToOne({
		entity: 'Tournament',
		joinColumn: 'tournament_id',
		referenceColumnName: 'tournament_id',
	})
	tournament!: Tournament;

	@ManyToOne({
		entity: 'Team',
		joinColumns: ['team_id'],
		referencedColumnNames: ['team_id'],
	})
	team!: Team;
}
