import { type Collection, Entity, Enum, ManyToOne, OneToMany, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Tournament } from './Tournament.entity';
import { Format } from './common';
import { BaseEntity } from './base.entity';
import { MatchupTeamParticipation } from './MatchupTeamParticipation.entity';
import { MatchupGame } from './MatchupGame.entity';

@Entity()
export class Matchup extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	matchupId!: number & Opt;

	@Property({ type: 'string' })
	shortId!: string & Opt;

	@ManyToOne({
		entity: () => Tournament,
		inversedBy: 'matchups',
	})
	tournament!: Tournament;

	@Enum({
		items: () => Format,
		nativeEnumName: 'format',
		nullable: true,
	})
	format?: Format;

	@OneToMany({
		entity: () => MatchupTeamParticipation,
		mappedBy: 'matchup',
	})
	teams!: MatchupTeamParticipation;

	@OneToMany({
		entity: () => MatchupGame,
		mappedBy: 'matchup',
	})
	games!: Collection<MatchupGame>;
}

export { Format } from './common';
