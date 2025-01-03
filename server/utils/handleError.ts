import type { User } from '@supabase/supabase-js'
import logger from './logging'

interface Response {
	data: unknown
	error: Error
	status: string
	statusText: string
}

/**
 * Takes the result of an supabase query and throws if any errors
 * occurred. 4xx errors of the PostgREST api will be propagated back
 * to the client (excluding details), while internal server errors will
 * throw a generic error message.
 *
 * Any error will be logged verbosely
 *
 * @param data any data that maybe got returned
 * @param status status code of the PostgREST api
 * @param statusText status text equivalent
 * @param error structure that holds information about the error
 * @param user the user that sent the request
 */
export default function handleError(user?: User, response: Response) {
	const { error, status, statusText, data } = response

	if (400 <= status && status < 500) {
		logger.error(
			`Error ${status} during ${event.toString()}\n \
user = ${JSON.stringify(user, null, 4)}\n \
error = ${JSON.stringify(error, null, 4)}
			`)
		throw createError({
			statusCode: status,
			statusMessage: statusText,
			message: error!.message,
			data: data,
		})
	}

	if (500 <= status && status < 600) {
		logger.error(
			`Error ${status} during ${event.toString()}\n \
user = ${JSON.stringify(user, null, 4)}\n \
error = ${JSON.stringify(error, null, 4)}
			`)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server error',
			message: 'Something unexpected happened',
		})
	}
}
