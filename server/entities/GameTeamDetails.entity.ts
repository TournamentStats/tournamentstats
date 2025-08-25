import { Entity, Enum, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import type { Game } from './Game.entity';
import { Side } from './common';
import { BaseEntity } from './base.entity';

@Entity()
export class GameTeamDetails extends BaseEntity {
	[PrimaryKeyProp]?: ['game', 'side'];

	@Enum({
		items: () => Side,
		primary: true,
		nativeEnumName: 'side',
	})
	side!: Side;

	@ManyToOne({
		entity: 'Game',
		primary: true,
		inversedBy: 'teamDetails',
		joinColumn: 'game_id',
		referenceColumnName: 'game_id',
	})
	game!: Game;

	@Property({
		type: 'string[]',
		nullable: true,
	})
	bans?: string[];

	@Property({
		type: 'boolean',
		nullable: true,
	})
	featEpicMonsterKill?: boolean;

	@Property({
		type: 'boolean',
		nullable: true,
	})
	featFirstBlood?: boolean;

	@Property({
		type: 'boolean',
		nullable: true,
	})
	featFirstTurret?: boolean;

	@Property({
		type: 'number',
		nullable: true,
	})
	atakhanKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	baronKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	dragonKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	riftHeraldKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	grubsKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	towerKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	inhibitorKills?: number;

	@Property({
		type: 'boolean',
		nullable: true,
	})
	win?: boolean;

	@Property({
		type: 'number',
		nullable: true,
	})
	kills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	deaths?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	assists?: number;
}

export { Side } from './common';
