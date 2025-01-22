import type { H3Event, Request } from 'h3'

export function authentication(event: H3Event<Request>): void {
	if (event.context.auth.user == null) {
		throw createError({
			status: 401,
			message: 'Unauthorized',
			statusMessage: 'Please authorize by logging in',
		})
	}
}

export function validateRouterParam(param: string): (event: H3Event<Request>) => void | Promise<void> {
	return function (event: H3Event<Request>): void {

	}
}
