/**
 * Flattens an object by a specific key
 *
 * @param obj object containing an object
 * @param key key of the object to flatten
 * @returns obj with obj[key] flattened into obj
 */
export function flattenByKey<T extends object, K extends keyof T>(
	obj: T,
	key: K,
): Omit<T, K> & T[K] {
	const { [key]: nested, ...rest } = obj;
	return { ...rest, ...nested };
}
