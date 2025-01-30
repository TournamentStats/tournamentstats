import logger from '../utils/logging'

const limit = {
	minutes: 300,
	hours: 120 * 60,
}

type Identifier = string
interface Bucket {
	minutes: {
		remaining: number
		lastUpdated: Date
	}
	hours: {
		remaining: number
		lastUpdated: Date
	}
}

const rateLimitStore = new Map<Identifier, Bucket>()

export default defineEventHandler((event) => {
	const user = event.context.auth.user

	const identifier = user?.id ?? getRequestIP(event, { xForwardedFor: true })

	if (!identifier) {
		logger.error('Authentication not found', {
			section: 'rate-limit',
			payload: {
				user: user?.id,
				address: getRequestIP(event, { xForwardedFor: true }),
			},
		})
		throw createError({
			status: 500,
			message: 'Internal Server Error',
			statusMessage: 'Cannot verify request. Consider logging in.',
		})
	}

	let bucket = rateLimitStore.get(identifier)
	const now = new Date()

	if (!bucket) {
		rateLimitStore.set(identifier, {
			minutes: {
				remaining: limit.minutes,
				lastUpdated: now,
			},
			hours: {
				remaining: limit.hours,
				lastUpdated: now,
			},
		})
		bucket = rateLimitStore.get(identifier)!
	}

	if (now.getTime() - bucket.minutes.lastUpdated.getTime() >= 60000) {
		bucket.minutes.remaining = limit.minutes
		bucket.minutes.lastUpdated = now
	}

	if (now.getTime() - bucket.hours.lastUpdated.getTime() >= 3600000) {
		bucket.hours.remaining = limit.hours
		bucket.hours.lastUpdated = now
	}

	if (bucket.minutes.remaining <= 0 || bucket.hours.remaining <= 0) {
		const retryAfter = bucket.hours.remaining <= 0
			? (bucket.hours.lastUpdated.getTime() + 3600000) - now.getTime()
			: (bucket.minutes.lastUpdated.getTime() + 60000) - now.getTime()
		appendResponseHeader(event, 'Retry-After', Math.floor(retryAfter / 1000))

		logger.warn(`Rate limit exceeded for ${identifier}`, {
			section: 'rate-limit',
			payload: {
				user: user?.id,
				address: event.context.clientAddress,
			},
		})

		throw createError({
			status: 429,
			message: 'Too many requests',
			statusMessage: 'Too many requests. Try again later.',
		})
	}

	bucket.minutes.remaining -= 1
	bucket.hours.remaining -= 1
})
