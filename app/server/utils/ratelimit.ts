import type { H3Event } from 'h3'

import { logger } from '@utils/logging'

interface Limitation {
	// time frame in seconds
	interval: number
	// number of requests allowed in the time frame
	limit: number
}

interface LimitExhaust { remaining: number, lastUpdated: Date }

interface Ratelimit {
	limits: Limitation[]
	store: Map<string, LimitExhaust[]>
}

const myLimit: Ratelimit = {
	limits: [
		{
			interval: 1,
			limit: 10,
		},
		{
			interval: 60,
			limit: 200,
		},
	],
	store: new Map<string, LimitExhaust[]>(),
}

export function ratelimit(allow_ips: boolean) {
	return (event: H3Event) => {
		if (!event.path.startsWith('/api')) {
			return
		}

		if (event.context.auth.user == null && !allow_ips) {
			throw createError({
				status: 401,
				message: 'Unauthorized',
				statusMessage: 'Please authorize by logging in',
			})
		}

		let identifier: string | undefined
		let identifierType: string | undefined

		if (event.context.auth.user) {
			identifier = event.context.auth.user.id
			identifierType = 'user'
		}
		else if (getRequestIP(event, { xForwardedFor: true }) != undefined) {
			identifier = getRequestIP(event, { xForwardedFor: true })
			identifierType = 'ip-address'
		}

		if (!identifier) {
			throw createError({
				status: 401,
				message: 'Unauthorized',
				statusMessage: 'This endpoint needs authorization, either through logging in or logging ip address',
			})
		}

		const now = new Date()
		let bucket = myLimit.store.get(identifier)

		if (!bucket) {
			bucket = myLimit.limits.map(
				limit => ({
					remaining: limit.limit,
					lastUpdated: now,
				}),
			)
			myLimit.store.set(identifier, bucket)
		}

		const exhausted = []

		for (const [limit, rem] of zip(myLimit.limits, bucket)) {
			// reset bucket when interval elapsed
			if (now.getTime() - rem.lastUpdated.getTime() >= limit.interval * 1000) {
				rem.remaining = limit.limit
				rem.lastUpdated = now
			}

			if (rem.remaining <= 0) {
				exhausted.push({ limit, rem })
			}
			else {
				rem.remaining -= 1
			}
		}

		if (exhausted.length > 0) {
			const retryAfter = Math.max(...exhausted.map(
				e => e.rem.lastUpdated.getTime() + e.limit.interval * 1000,
			)) - now.getTime()
			appendResponseHeader(event, 'Retry-After', Math.ceil(retryAfter / 1000))

			logger.warn(`Rate limit exceeded for ${identifier} on path ${event.path}`, {
				section: 'rate-limit',
				payload: {
					identifier,
					identifierType,
					exhausted: exhausted,
				},
			})

			throw createError({
				status: 429,
				statusMessage: 'Too many requests',
				message: 'Too many requests. Try again later.',
			})
		}
	}
}

type TupleOf<T extends unknown[][]> = {
	[K in keyof T]: T[K] extends (infer U)[] ? U : never;
}

function zip<T extends unknown[][]>(
	...arrays: T
): TupleOf<T>[] {
	const minLength = Math.min(...arrays.map(arr => arr.length))
	const result: TupleOf<T>[] = []

	for (let i = 0; i < minLength; i++) {
		const tuple = arrays.map(arr => arr[i]) as TupleOf<T>
		result.push(tuple)
	}

	return result
}
