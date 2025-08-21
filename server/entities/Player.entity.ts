import { type Collection, Entity, Enum, OneToMany, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Region } from './common';
import { BaseEntity } from './base.entity';
import { TournamentPlayerParticipation } from './TournamentPlayerParticipation.entity';
import { GamePlayerDetails } from './GamePlayerDetails.entity';

@Entity()
export class Player extends BaseEntity {
	@PrimaryKey({ type: 'string' })
	puuid!: string;

	@Property({ type: 'date' })
	lastUpdated!: Date & Opt;

	@Property({ type: 'number' })
	profileIconId!: number;

	@Property({ type: 'string' })
	gameName!: string;

	@Property({ type: 'string' })
	tagLine!: string;

	@Enum({
		items: () => Region,
		nativeEnumName: 'region',
	})
	region!: Region;

	@OneToMany({
		entity: () => TournamentPlayerParticipation,
		mappedBy: 'puuid',
	})
	tournamentParticipations!: Collection<TournamentPlayerParticipation>;

	@OneToMany({
		entity: () => GamePlayerDetails,
		mappedBy: 'puuid',
	})
	gameDetails!: Collection<GamePlayerDetails>;
}

export { Region } from './common';
