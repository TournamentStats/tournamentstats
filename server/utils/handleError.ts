import type { PostgrestResponseFailure } from '@supabase/postgrest-js'
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
export default function handleError(response: PostgrestResponseFailure): never {
	const { error, status, statusText, data } = response

	// Error codes 400 - 500 should be propagated to the end user
	// as the server is not responsible for the error
	if (400 <= status && status < 500) {
		throw createError({
			statusCode: status,
			statusMessage: statusText,
			message: error.message,
			data: data,
		})
	}

	// internal server errors are mostly irrelevant to users, so give them a generic error message
	// but they are relevant to us, so error log them
	throw createError({
		statusCode: 500,
		statusMessage: 'Internal Server error',
		message: 'Something unexpected happened',
	})
}
