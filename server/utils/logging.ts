import { createLogger, format, transports } from 'winston'

import type { H3Event, EventHandlerRequest, EventHandlerResponse } from 'h3'

declare module 'h3' {
	interface H3EventContext {
		errors: Error[]
	}
}

// Helper function to format payloads as JSON
const formatPayload = (payload: object): string =>
	payload ? JSON.stringify(payload, null, 4) : ''

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	),
	transports: [
		// Human-readable log transport
		new transports.File({
			filename: 'logs/latest.log',
			format: format.combine(
				format.printf(({ timestamp, level, message, ...meta }) => {
					const payload = meta.payload || null
					const formattedPayload = payload ? formatPayload(payload) : ''
					return `${timestamp} [${level.toUpperCase()}] ${meta.section ? `${meta.section} - ` : ''}${message}\n${formattedPayload}`
				}),
			),
		}),
		// JSON log transport
		new transports.File({
			filename: 'logs/latest_log.jsonl',
			format: format.combine(
				format.json(),
				format.printf(({ timestamp, level, message, ...meta }) => {
					const payload = meta.payload || null
					const section = meta.section || null
					return JSON.stringify({
						timestamp,
						level,
						message,
						payload,
						section,
					})
				}),
			),
		}),
	],
})

logger.info('Logging started')

export default logger

export function logAPI(event: H3Event<EventHandlerRequest>, response: {
	body?: Awaited<EventHandlerResponse>
}): void {
	logger.info(`${event.toString()}`, {
		section: 'Tournament API',
		payload: {
			response,
			errors: event.context.errors,
			// dev only logging
			...import.meta.dev && {
				user: event.context.auth.user,
				ip_adress: getRequestIP(event, { xForwardedFor: true }),
			},
		},
	})
}
