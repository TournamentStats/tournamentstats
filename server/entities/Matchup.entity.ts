import { Collection, Entity, Enum, ManyToMany, ManyToOne, type Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import type { Tournament } from './Tournament.entity';
import { Format } from './common';
import { BaseEntity } from './base.entity';
import { MatchupGame } from './MatchupGame.entity';
import { Game } from './Game.entity';

@Entity()
@Unique({ properties: ['tournament', 'matchupId'] })
export class Matchup extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	matchupId!: number & Opt;

	@Property({ type: 'string' })
	shortId!: string & Opt;

	@ManyToOne({
		entity: 'Tournament',
		inversedBy: 'matchups',
		joinColumn: 'tournament_id',
		referenceColumnName: 'tournament_id',
	})
	tournament!: Tournament;

	@Enum({
		items: () => Format,
		nativeEnumName: 'format',
		nullable: true,
	})
	format?: Format;

	@ManyToMany({
		entity: () => Game,
		pivotEntity: () => MatchupGame,
	})
	games = new Collection<Game>(this);
}

export { Format } from './common';
