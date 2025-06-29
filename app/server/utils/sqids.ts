import Sqids from 'sqids'

export const image_ids = new Sqids({
	minLength: 10,
	alphabet: process.env.IMAGE_ID_ALPHABET,
	blocklist: new Set(['default', 'placeholder']),
})
