import { z } from 'zod'

import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

const requestBody = z.object({
	name: z.string().min(3).max(32),
	isPrivate: z.boolean(),
	imageId: z.string().optional(),
})

/**
 * POST /api/tournament
 *
 * Creates an tournament
 *
 * RequestBody: information about the tournament
 * 	name: string
 * 	isPrivate: string
 * 	imageId?: string
 *
 * Returns: Information about the created tournament
 * 	short_id: string
 * 	owner_id: string (uuid)
 * 	name: string
 * 	is_private : boolean
 * 	start_date: string (iso date)
 * 	end_date: string (iso date)
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user

		if (user == null) {
			throw createError({
				status: 401,
				message: 'Unauthorized',
				statusMessage: 'Please authorize by logging in',
			})
		}

		const { name, isPrivate, imageId } = await readValidatedBody(event, requestBody.parse)

		// we could also use the authenticated client if RLS is properly setup
		// const client = await serverSupabaseClient(event)
		const client = await serverSupabaseServiceRole(event)

		const { data, error, status, statusText } = await client.from('tournament')
			.insert({ name: name, owner_id: user.id, is_private: isPrivate, image_path: `${imageId}.png` })
			.select(
				'short_id, owner_id, name, is_private, start_date, end_date, image_path',
			)

		handleError(data, status, statusText, error, user)
		setResponseStatus(event, 201, 'Created')
		return data
	},
})
