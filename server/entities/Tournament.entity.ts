import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Region } from './common';
import { SupabaseUser } from './SupabaseUser.entity';
import { BaseEntity } from './base.entity';
import { TournamentTeamParticipation } from './TournamentTeamParticipation.entity';
import { TournamentPlayerParticipation } from './TournamentPlayerParticipation.entity';
import { Team } from './Team.entity';
import { Player } from './Player.entity';
import { Matchup } from './Matchup.entity';

@Entity()
export class Tournament extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	tournamentId!: number & Opt;

	@Property({ type: 'string' })
	shortId!: string & Opt;

	@Property({ type: 'string' })
	name!: string;

	@ManyToOne({
		entity: () => SupabaseUser,
		inversedBy: 'tournaments',
		joinColumn: 'owner_id',
		referenceColumnName: 'id',
	})
	owner!: SupabaseUser;

	@Property({
		type: 'date',
		nullable: true,
	})
	startDate?: Date;

	@Property({
		type: 'date',
		nullable: true,
	})
	endDate?: Date;

	@Property({ type: 'boolean' })
	isPrivate!: boolean;

	@Enum({
		items: () => Region,
		nativeEnumName: 'region',
	})
	region!: Region;

	@ManyToMany({
		entity: () => Team,
		pivotEntity: () => TournamentTeamParticipation,
	})
	teams = new Collection<Team>(this);

	@ManyToMany({
		entity: () => Player,
		pivotEntity: () => TournamentPlayerParticipation,
	})
	players = new Collection<Player>(this);

	@OneToMany({
		entity: () => Matchup,
		mappedBy: 'tournament',
	})
	matchups = new Collection<Matchup>(this);
}

export { Region } from './common';
