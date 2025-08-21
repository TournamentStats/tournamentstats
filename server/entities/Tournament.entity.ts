import { type Collection, Entity, Enum, ManyToOne, OneToMany, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Region } from './common';
import { SupabaseUser } from './SupabaseUser.entity';
import { BaseEntity } from './base.entity';
import { TournamentTeamParticipation } from './TournamentTeamParticipation.entity';
import { TournamentShareToken } from './TournamentShareToken.entity';
import { TournamentPlayerParticipation } from './TournamentPlayerParticipation.entity';
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

	@OneToMany({
		entity: () => TournamentTeamParticipation,
		mappedBy: 'tournament',
	})
	participatingTeams!: Collection<TournamentTeamParticipation>;

	@OneToMany({
		entity: () => TournamentPlayerParticipation,
		mappedBy: 'tournament',
	})
	participatingPlayers!: Collection<TournamentPlayerParticipation>;

	@OneToMany({
		entity: () => Matchup,
		mappedBy: 'tournament',
	})
	matchups!: Collection<Matchup>;

	@OneToMany({
		entity: () => TournamentShareToken,
		mappedBy: 'tournament',
	})
	shareTokens!: Collection<TournamentShareToken>;
}

export { Region } from './common';
