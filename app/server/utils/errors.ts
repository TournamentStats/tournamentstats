export function createGenericError({ statusCode, statusMessage, message }: { statusCode?: number, statusMessage?: string, message?: string } = {}) {
	return createError({
		statusCode: statusCode ?? 500,
		statusMessage: statusMessage ?? 'Internal Server error',
		message: message ?? 'Something unexpected happened',
	})
}

export function createNotFoundError(resource: string, extra?: string) {
	return createError({
		statusCode: 404,
		statusMessage: 'Not Found',
		statusText: `${resource} not found${extra != undefined ? ` ${extra}` : ''}`,
	})
}
