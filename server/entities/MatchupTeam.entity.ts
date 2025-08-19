import { BaseEntity, Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Matchup } from './Matchup.entity';
import { Team } from './Team.entity';
import { Tournament } from './Tournament.entity';

@Entity()
export class MatchupTeam extends BaseEntity {
	[PrimaryKeyProp]?: ['matchup', 'team'];

	@Property({ type: 'number' })
	ordering!: number;

	@ManyToOne(() => Tournament)
	tournament!: Tournament;

	@ManyToOne({
		entity: () => Matchup,
		primary: true,
	})
	matchup!: Matchup;

	@ManyToOne({
		entity: () => Team,
		primary: true,
	})
	team!: Team;
}
