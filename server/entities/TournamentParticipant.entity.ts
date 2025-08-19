import { Entity, ManyToOne, Enum, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Player } from './Player.entity';
import { Team } from './Team.entity';
import { Tournament } from './Tournament.entity';
import { TeamPosition } from './common';
import { BaseEntity } from './base.entity';

@Entity()
export class TournamentParticipant extends BaseEntity {
	[PrimaryKeyProp]?: ['puuid', 'tournament'];

	@ManyToOne({
		entity: () => Player,
		primary: true,
	})
	puuid!: Player;

	@ManyToOne({
		entity: () => Tournament,
		primary: true,
	})
	tournament!: Tournament;

	@Property({
		type: 'string',
		nullable: true,
	})
	name?: string;

	@ManyToOne({
		entity: () => Team,
		nullable: true,
	})
	team?: Team;

	@Enum({
		items: () => TeamPosition,
		nativeEnumName: 'lol_position',
		nullable: true,
	})
	teamPosition?: TeamPosition;
}

export { TeamPosition } from './common';
