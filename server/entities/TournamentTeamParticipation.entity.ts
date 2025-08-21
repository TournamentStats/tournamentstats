import { Entity, ManyToOne, OneToMany, PrimaryKeyProp, type Collection } from '@mikro-orm/core';
import { Team } from './Team.entity';
import { Tournament } from './Tournament.entity';
import { BaseEntity } from './base.entity';
import { MatchupTeamParticipation } from './MatchupTeamParticipation.entity';

@Entity()
export class TournamentTeamParticipation extends BaseEntity {
	[PrimaryKeyProp]?: ['team_id', 'tournament_id'];

	@ManyToOne({
		entity: () => Team,
		primary: true,
		inversedBy: 'tournamentParticipations',
	})
	team!: Team;

	@ManyToOne({
		entity: () => Tournament,
		primary: true,
		inversedBy: 'participatingTeams',
	})
	tournament!: Tournament;

	@OneToMany({
		entity: () => MatchupTeamParticipation,
		mappedBy: 'team',
	})
	matchups!: Collection<MatchupTeamParticipation>;
}
