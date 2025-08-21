import { BaseEntity, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKeyProp, Property, type Collection } from '@mikro-orm/core';
import { Matchup } from './Matchup.entity';
import { Tournament } from './Tournament.entity';
import { TournamentTeamParticipation } from './TournamentTeamParticipation.entity';
import { MatchupGameTeamParticipation } from './MatchupGameTeamParticipation.entity';
import { Team } from './Team.entity';

@Entity()
export class MatchupTeamParticipation extends BaseEntity {
	[PrimaryKeyProp]?: ['matchup', 'team'];

	@ManyToOne({
		entity: () => Matchup,
		primary: true,
		inversedBy: 'teams',
	})
	matchup!: Matchup;

	@ManyToMany({
		entity: () => Team,
		primary: true,
		pivotEntity: () => TournamentTeamParticipation,
	})
	team!: Team;

	@Property({ type: 'number' })
	ordering!: number;

	// don't need inverse mapping
	@ManyToOne(() => Tournament)
	tournament!: Tournament;

	@OneToMany({
		entity: () => MatchupGameTeamParticipation,
		mappedBy: 'team',
	})
	games!: Collection<MatchupGameTeamParticipation>;
}
