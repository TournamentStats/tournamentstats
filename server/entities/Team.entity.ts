import { Entity, ManyToOne, type Opt,	PrimaryKey,	Property,	Unique } from '@mikro-orm/core';
import { Tournament } from './Tournament.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Unique({
	name: 'team_tournament_id_team_id_key',
	properties: ['tournament', 'teamId'],
})
export class Team extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	teamId!: number & Opt;

	@Property({ type: 'string' })
	shortId!: string & Opt;

	@ManyToOne(() => Tournament)
	tournament!: Tournament;

	@Property({ type: 'string' })
	name!: string;

	@Property({
		type: 'string',
		nullable: true,
	})
	abbreviation?: string;
}
