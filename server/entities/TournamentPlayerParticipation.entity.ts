import { Entity, ManyToOne, Enum, Property, PrimaryKey } from '@mikro-orm/core';
import { Player } from './Player.entity';
import { Tournament } from './Tournament.entity';
import { TeamPosition } from './common';
import { BaseEntity } from './base.entity';
import { TournamentTeamParticipation } from './TournamentTeamParticipation.entity';

@Entity()
export class TournamentPlayerParticipation extends BaseEntity {
	@PrimaryKey({
		type: 'number',
		autoincrement: true,
	})
	id!: number;

	@ManyToOne({ entity: () => Player })
	puuid!: Player;

	@ManyToOne({ entity: () => Tournament })
	tournament!: Tournament;

	@ManyToOne({
		entity: () => TournamentTeamParticipation,
		nullable: true,
	})
	teamParticipation?: TournamentTeamParticipation;

	@Property({
		type: 'string',
		nullable: true,
	})
	teamSpecificName?: string;

	@Enum({
		items: () => TeamPosition,
		nativeEnumName: 'lol_position',
		nullable: true,
	})
	teamPosition?: TeamPosition;
}

export { TeamPosition } from './common';
