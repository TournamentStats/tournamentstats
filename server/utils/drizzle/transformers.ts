export function maybeSingle<T>(values: T[]): T | undefined {
	if (values.length > 1) throw new Error('Found non unique value');
	if (values.length == 1) {
		return values[0];
	}
	return undefined;
}

export function single<T>(values: T[]): T {
	if (values.length != 1) throw new Error('Found non unique or inexistent value');
	return values[0] as T;
}
