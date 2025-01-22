import { createLogger, format, transports } from 'winston'

import type { H3Event, Request, Response } from 'h3'

declare module 'h3' {
	interface H3EventContext {
		errors: Error[]
	}
}

// const customFormat = format.printf(({ level, message, timestamp }) => {
// 	return `${timestamp} [${level.toUpperCase()}] ${message}`
// })

// const loggerOld = createLogger({
// 	level: 'info',
// 	transports: [
// 		new transports.File({
// 			filename: 'logs/latest.log',
// 			format: format.combine(
// 				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
// 				format.splat(),
// 				customFormat,
// 			),
// 		}),
// 	],
// })

// Helper function to format payloads as JSON
const formatPayload = (payload): string =>
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

export function logAPI(event: H3Event<Request>, response: {
	body?: Awaited<Response>
}): void {
	logger.info(`${event.toString()}`, {
		section: 'Tournament API',
		payload: {
			response,
			errors: event.context.errors,
			// dev only logging
			...import.meta.dev && {
				user: event.context.auth.user,
				ip_adress: event.context.clientAddress,
			},
		},
	})
}
