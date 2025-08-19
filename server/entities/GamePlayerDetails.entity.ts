import { Entity, Enum, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Game } from './Game.entity';
import { Player } from './Player.entity';
import { Side } from './common';
import { BaseEntity } from './base.entity';

@Entity()
export class GamePlayerDetails extends BaseEntity {
	[PrimaryKeyProp]?: ['puuid', 'game'];

	@ManyToOne({
		entity: () => Player,
		primary: true,
	})
	puuid!: Player;

	@ManyToOne({
		entity: () => Game,
		primary: true,
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
		type: 'number',
		nullable: true,
	})
	item0?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	item1?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	item2?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	item3?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	item4?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	item5?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	item6?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	capstoneRuneId?: number;

	@Property({
		fieldName: 'primary_rune1_id',
		type: 'number',
		nullable: true,
	})
	primaryRune1Id?: number;

	@Property({
		fieldName: 'primary_rune2_id',
		type: 'number',
		nullable: true,
	})
	primaryRune2Id?: number;

	@Property({
		fieldName: 'primary_rune3_id',
		type: 'number',
		nullable: true,
	})
	primaryRune3Id?: number;

	@Property({
		fieldName: 'sub_rune1_id',
		type: 'number',
		nullable: true,
	})
	subRune1Id?: number;

	@Property({
		fieldName: 'sub_rune2_id',
		type: 'number',
		nullable: true,
	})
	subRune2Id?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	statDefense?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	statFlex?: number;

	@Property({
		type: 'number',
		nullable: true,
	})
	statOffense?: number;

	@Property({
		fieldName: 'summoner1_id',
		type: 'number',
		nullable: true,
	})
	summoner1Id?: number;

	@Property({
		fieldName: 'summoner2_id',
		type: 'number',
		nullable: true,
	})
	summoner2Id?: number;

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
