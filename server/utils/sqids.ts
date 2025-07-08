import Sqids from 'sqids'

export const image_ids = new Sqids({
	minLength: 10,
	alphabet: useRuntimeConfig().alphabets.imageIds,
	blocklist: new Set(['default', 'placeholder']),
})
