import type { H3Event } from 'h3';

export function getEntityManager(event: H3Event) {
	return event.context.em;
}
