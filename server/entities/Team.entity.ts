import { Collection, Entity, ManyToMany, ManyToOne, type Opt,	PrimaryKey,	Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import type { SupabaseUser } from './SupabaseUser.entity';
import { Matchup } from './Matchup.entity';
import { MatchupTeamParticipation } from './MatchupTeamParticipation.entity';
import { Tournament } from './Tournament.entity';

@Entity()
export class Team extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	teamId!: number & Opt;

	@Property({ type: 'string' })
	shortId!: string & Opt;

	@ManyToOne({
		entity: 'SupabaseUser',
		inversedBy: 'teams',
		joinColumn: 'owner_id',
		referenceColumnName: 'id',
	})
	owner!: SupabaseUser;

	@Property({ type: 'string' })
	teamName!: string;

	@Property({
		type: 'string',
		nullable: true,
	})
	abbreviation?: string;

	@Property({ type: 'boolean' })
	isPrivate!: boolean;

	@ManyToMany({
		entity: () => Matchup,
		pivotEntity: () => MatchupTeamParticipation,
	})
	matchups = new Collection<Matchup>(this);

	@ManyToMany({
		entity: () => Tournament,
		mappedBy: 'teams',
	})
	tournaments = new Collection<Tournament>(this);
}
