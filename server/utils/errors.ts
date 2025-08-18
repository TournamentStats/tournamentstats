import { H3Error } from 'h3';
import type { H3Event } from 'h3';
import { ZodError, z } from 'zod/v4';

export function createGenericError({
	statusCode,
	statusMessage,
	message,
	data,
}: {
	statusCode?: number;
	statusMessage?: string;
	message?: string;
	data?: object;
} = {},
) {
	return createError({
		statusCode: statusCode ?? 500,
		statusMessage: statusMessage ?? 'Internal Server error',
		message: message ?? 'Something unexpected happened',
		data,
	});
}

export function createNotFoundError(resource: string, data?: unknown) {
	return createError({
		statusCode: 404,
		statusMessage: 'Not Found',
		message: `${resource} not found`,
		data,
	});
}

interface ErrorData {
	statusCode: number;
	statusMessage?: string;
	error?: {
		message: string;
		data?: unknown;
	};
}

/**
 * Wraps a handler function for the defineEventHandler. Is responsible for a global
 * error handling/clean up solution, as long as there is no good way to do this in
 * nitro + nuxt without overriding the error handler, which affects nuxt error
 * handling.
 *
 * Currently does the following:
 * - creates an Error Object based on the original error
 * - If the original error is an H3Error, copy status code and message, else just an generic 500 internal server error
 * - Handle special errors, for now convert ZodError to Validation Error (may need finetuning)
 * - set response headers and status
 * - Pushes Internal Server Errors in the event context
 * - return the error data, so the server engines sends it als 'normal' response, we don't want nuxt error pages, we need json errors
 *
 * @param handler The handler you would put inside the defineEventHandler
 * @returns A function the event handler can use.
 */
export function withErrorHandling<ReturnData>(
	handler: (event: H3Event) => Promise<ReturnData> | ReturnData,
): (event: H3Event) => Promise<ReturnData | ErrorData> | ReturnData | ErrorData {
	return async function (event: H3Event) {
		try {
			return await handler(event);
		}
		catch (e: unknown) {
			if (e instanceof Error) {
				// base generic error data we want to return as json
				const errorData: ErrorData = {
					statusCode: 500,
					statusMessage: 'Internal Server error',
				};

				// get information from H3Error
				if (e instanceof H3Error) {
					errorData.statusCode = e.statusCode;
					errorData.statusMessage = e.statusMessage;
					errorData.error = {
						message: e.message,
					};
				}

				// fill error details manually

				// Check if error originates as Validation Error
				if (e instanceof H3Error && e.data instanceof ZodError) {
					errorData.error = {
						message: 'Validation Error',
						data: z.flattenError(e.data).fieldErrors,
					};
				}

				// log unexpected errors
				if (errorData.statusCode >= 500 && errorData.statusCode < 600) {
					event.context.errors.push(e);
				}

				setResponseHeader(event, 'Content-Type', 'application/json');
				setResponseStatus(event, errorData.statusCode, errorData.statusMessage);
				return errorData;
			}
			throw e;
		}
	};
}
