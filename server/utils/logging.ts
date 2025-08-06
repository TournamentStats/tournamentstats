import { createLogger, format, transports, type LogEntry } from 'winston';
import TransportStream from 'winston-transport';
import type { H3Event, EventHandlerResponse } from 'h3';
import type { TransformableInfo } from 'logform';
import consola from 'consola';

declare module 'h3' {
	interface H3EventContext {
		errors: Error[];
	}
}

interface Meta {
	payload?: Record<string, unknown> & { user?: string; ipAddress?: string; errors?: Error[] };
	section?: string;
}

class ConsolaTransport extends TransportStream {
	override log(info: LogEntry & { payload: { errors: Error[] } }, callback?: () => void) {
		setImmediate(() => this.emit('logged', info));

		const { level, message, ...meta } = info;

		switch (level) {
			case 'error':
				consola.error({ message, ...meta });
				for (const error of meta.payload.errors) {
					consola.error(error);
				}
				break;
			case 'warn':
				consola.warn(message);
				break;
			case 'info':
				consola.info(message);
				break;
			case 'debug':
				consola.debug(message);
				break;
			default:
				consola.log(message);
		}

		if (callback) callback();
	}
}

// Helper function to format payloads as JSON
const formatPayload = (payload: object): string => JSON.stringify(payload, null, 4);

function indentStack(stack: string | undefined, indent = 4): string {
	if (!stack) return '';
	const pad = ' '.repeat(indent);
	return stack.split('\n').map((line, i) => {
		if (i == 0)
			return line.trim();
		return pad + line.trim();
	}).join('\n');
}

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.errors({ stack: true }),
	),
	transports: [
		new ConsolaTransport(),
		new transports.File({
			filename: 'logs/latest.log',
			format: format.combine(
				format.printf(({ timestamp, level, message, section, payload }: TransformableInfo & Meta) => {
					let log = `${timestamp as string} [${level.toUpperCase()}] ${section ? `${section} - ` : ''}${message as string}`;

					if (payload) {
						if (payload.errors?.length) {
							log += '\nErrors:';
							payload.errors.forEach((err: Error, i: number) => {
								log += `\n  [${(i + 1).toString()}] ${indentStack(err.stack, 4)}`;
							});
						}

						if (payload.response) {
							log += `\nResponse:\n${formatPayload(payload.response)}`;
						}

						log += `\nUser: ${payload.user ?? 'N/A'}`;
						log += `\nIP Address: ${payload.ipAddress ?? 'N/A'}`;
					}

					return log;
				}),
			),
		}),
		// JSON log transport
		new transports.File({
			filename: 'logs/latest_log.jsonl',
			format: format.combine(
				format.json(),
				format.printf(({ timestamp, level, message, ...meta }) => {
					const payload = meta.payload && null;
					const section = meta.section && null;
					return JSON.stringify({
						timestamp,
						level,
						message,
						payload,
						section,
					});
				}),
			),
		}),
	],
});

logger.info('Logging started');

export { logger };

// utility functions for logging

// Log the result of an API, including route, user/ip and errors, if occured
export function logAPI(event: H3Event, response?: {
	body?: Awaited<EventHandlerResponse>;
}): void {
	if (event.context.errors.length > 0) {
		logger.error(event.toString(), {
			section: 'Tournament API',
			payload: {
				response,
				errors: event.context.errors,
				user: event.context.auth.user,
				ipAddress: getRequestIP(event, { xForwardedFor: true }),
			},
		});
	}
	else {
		logger.info(event.toString(), {
			section: 'Tournament API',
			payload: {
				response,
				user: event.context.auth.user,
				ipAddress: getRequestIP(event, { xForwardedFor: true }),
			},
		});
	}
}
