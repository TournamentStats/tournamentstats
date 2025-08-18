import Sqids from 'sqids';

export const imageIds = new Sqids({
	minLength: 10,
	alphabet: useRuntimeConfig().alphabets.imageIds,
	blocklist: new Set(['default', 'placeholder']),
});
