import { Entity, Enum, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Game } from './Game.entity';
import { Player } from './Player.entity';
import { Side } from './common';
import { BaseEntity } from './base.entity';

export interface Build {
	items: {
		item0_id: number;
		item1_id: number;
		item2_id: number;
		item3_id: number;
		item4_id: number;
		item5_id: number;
		item6_id: number;
	};
	runes: {
		primary: {
			rune1_id: number;
			rune2_id: number;
			rune3_id: number;
			rune4_id: number;
		};
		sub: {
			rune1_id: number;
			rune2_id: number;
		};
		stat_perks: {
			defense: number;
			flex: number;
			offense: number;
		};
	};
	summoner_spell1_id: number;
	summoner_spell2_id: number;
}

@Entity()
export class GamePlayerDetails extends BaseEntity {
	[PrimaryKeyProp]?: ['puuid', 'game'];

	@ManyToOne({
		entity: () => Player,
		primary: true,
		inversedBy: 'gameDetails',
	})
	puuid!: Player;

	@ManyToOne({
		entity: () => Game,
		primary: true,
		inversedBy: 'playerDetails',
	})
	game!: Game;

	@Property({ type: 'number' })
	champId!: number;

	@Property({
		type: 'string',
		nullable: true,
	})
	position?: string;

	@Property({ type: 'number' })
	participantId!: number;

	@Enum({
		items: () => Side,
		nativeEnumName: 'side',
	})
	side!: Side;

	@Property({
		type: 'json',
		nullable: true,
	})
	build?: Build;

	@Property({
		type: 'boolean',
		nullable: true,
	})
	win?: boolean;

	@Property({
		type: 'number',
		nullable: true,
	})
	champLevel?: number;

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

	@Property({
		type: 'number',
		nullable: true,
	})
	doubleKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	tripleKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	quadraKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	pentaKills?: number;

	@Property({
		type: 'boolean',
		nullable: true,
	})
	firstBloodKill?: boolean;

	@Property({
		type: 'boolean',
		nullable: true,
	})
	firstTowerKill?: boolean;

	@Property({
		type: 'number',
		nullable: true,
	})
	totalEnemyJungleMinionKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	totalMinionKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	turretKills?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	ccScore?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	objectivesStolen?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	goldEarned?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	damageToTurrets?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	totalDamageDealtToChampions?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	magicDamageDealtToChampions?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	physicalDamageDealtToChampions?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	trueDamageDealtToChampions?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	totalDamageTaken?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	phyiscalDamageTaken?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	magicalDamageTaken?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	trueDamageTaken?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	damageSelfMitigated?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	totalHealingDone?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	totalAllyHealing?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	totalDamageShielded?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	visionScore?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	wardsKilled?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	wardsPlaced?: number;
}

export { Side } from './common';
