import { createLogger, format, transports } from 'winston'

const customFormat = format.printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level.toUpperCase()}] ${message}`
})

const logger = createLogger({
	level: 'info',
	transports: [
		new transports.File({
			filename: 'logs/latest.log',
			format: format.combine(
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				format.splat(),
				customFormat,
			),
		}),
	],
})

logger.info('Logging started')

export default logger
