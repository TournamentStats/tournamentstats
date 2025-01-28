import type { H3Event } from 'h3'

export function ratelimit(event: H3Event<Request>): void {
	if (event.context.auth.user == null) {
		throw createError({
			status: 401,
			message: 'Unauthorized',
			statusMessage: 'Please authorize by logging in',
		})
	}
}

type Bucket = {
	minutes: {
		remaining: number
		limit: number
		lastUpdated: Date
	}
	hours: {
		remaining: number
		limit: number
		lastUpdated: Date
	}
}

const endPointRateLimitStore = new Map<string, Bucket>()

export enum RateLimitMethod {
	IP,
	SESSION,
}

export interface RateLimitOptions {
	requestsPerMinute?: number
	requestsPerHour?: number
}

export function endPointRateLimit(options: RateLimitOptions): (event: H3Event<Request>) => void {
	return (event: H3Event<Request>): void => {
		const identifier = event.path
		let bucket = endPointRateLimitStore.get(identifier)
		const now = new Date()

		if (!bucket) {
			endPointRateLimitStore.set(identifier, {
				minutes: {
					remaining: options.requestsPerMinute ?? Infinity,
					limit: options.requestsPerMinute ?? Infinity,
					lastUpdated: now,
				},
				hours: {
					remaining: options.requestsPerHour ?? Infinity,
					limit: options.requestsPerHour ?? Infinity,
					lastUpdated: now,
				},
			})
			bucket = endPointRateLimitStore.get(identifier) as Bucket
		}

		if (now.getTime() - bucket.minutes.lastUpdated.getTime() >= 60000) {
			bucket.minutes.remaining = bucket.minutes.limit
			bucket.minutes.lastUpdated = now
		}

		if (now.getTime() - bucket.hours.lastUpdated.getTime() >= 3600000) {
			bucket.hours.remaining = bucket.hours.limit
			bucket.hours.lastUpdated = now
		}

		if (bucket.minutes.remaining <= 0 || bucket.hours.remaining <= 0) {
			const retryAfter = bucket.hours.remaining <= 0
				? (bucket.hours.lastUpdated.getTime() + 3600000) - now.getTime()
				: (bucket.minutes.lastUpdated.getTime() + 60000) - now.getTime()
			appendResponseHeader(event, 'Retry-After', Math.floor(retryAfter / 1000))
			throw createError({
				status: 429,
				statusMessage: 'Too many requests',
				message: 'Too many requests. Try again later.',
			})
		}

		bucket.minutes.remaining -= 1
		bucket.hours.remaining -= 1
	}
}
