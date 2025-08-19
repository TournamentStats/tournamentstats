import { Property, type Opt } from '@mikro-orm/core';

export abstract class BaseEntity {
	@Property({ type: 'Date' })
	createdAt!: Date & Opt;
}
