import { Entity, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Tournament } from './Tournament.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class TournamentShareToken extends BaseEntity {
	@PrimaryKey({ type: 'number' })
	id!: number & Opt;

	@Property({ type: 'string' })
	shareToken!: string;

	@ManyToOne({
		entity: () => Tournament,
		inversedBy: 'shareTokens',
	})
	tournament!: Tournament;
}
