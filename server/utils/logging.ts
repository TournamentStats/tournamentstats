import { createLogger, format, transports } from 'winston'
import type { H3Event, EventHandlerResponse } from 'h3'
import type { TransformableInfo } from '../../node_modules/.pnpm/logform@2.7.0/node_modules/logform/index.d.ts'

declare module 'h3' {
	interface H3EventContext {
		errors: Error[]
	}
}

interface Meta {
	payload?: object
	section?: string
}

// Helper function to format payloads as JSON
const formatPayload = (payload: object): string => JSON.stringify(payload, null, 4)

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
				format.printf(({ timestamp, level, message, ...meta }: TransformableInfo & Meta) => {
					const formattedPayload = meta.payload ? formatPayload(meta.payload) : ''
					return `${timestamp as string} [${level.toUpperCase()}] ${meta.section ? `${meta.section} - ` : ''}${message?.toString() ?? ''}\n${formattedPayload}`
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

export function logAPI(event: H3Event, response: {
	body?: Awaited<EventHandlerResponse>
}): void {
	logger.info(event.toString(), {
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
