import { Entity, ManyToOne, Enum, Property, PrimaryKey } from '@mikro-orm/core';
import type { Player } from './Player.entity';
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

	@ManyToOne({
		entity: 'Player',
		joinColumn: 'puuid',
		referenceColumnName: 'puuid',
	})
	player!: Player;

	@ManyToOne({
		entity: () => Tournament,
		joinColumn: 'tournament_id',
		referenceColumnName: 'tournament_id',
	})
	tournament!: Tournament;

	// maybe allowed?
	@ManyToOne({
		entity: () => TournamentTeamParticipation,
		nullable: true,
		joinColumns: ['tournament_id', 'team_id'],
		referencedColumnNames: ['tournament_id', 'team_id'],
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
