import { Entity, Enum, Property } from '@mikro-orm/core';
import { Format } from './common';

@Entity()
export class FormatAbbrevation {
	// [PrimaryKeyProp]?: 'format';

	@Enum({
		items: () => Format,
		primary: true,
		nativeEnumName: 'format',
	})
	format!: Format;

	@Property({ type: 'string' })
	abbrevation!: string;
}

export { Format } from './common';
