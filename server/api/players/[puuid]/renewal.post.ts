/**
 * Accepts a puuid and updates the database with riot api information (name, summoner icon)
 */
import { z } from 'zod'

import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'
import { endPointRateLimit } from '~/server/utils/ratelimit'
import { Platform, Region, riotFetch } from '~/server/utils/riotFetch'

import type { Summoner, Account } from '~/types/riot.types'

const puuidSchema = z.string().length(78)

/**
 * Accepts list of puuids to remove/add to team
 */
export default defineEventHandler({
	onRequest: [
		authentication,
		endPointRateLimit({ requestsPerMinute: 360, requestsPerHour: 7200 }),
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const client = serverSupabaseServiceRole(event)

		const puuid = encodeURIComponent(puuidSchema.parse(getRouterParam(event, 'puuid')))

		const lastUpdatedResponse = await client.from('player')
			.select('last_updated')
			.eq('puuid', puuid)
			.maybeSingle()

		if (lastUpdatedResponse.error) {
			event.context.errors.push(lastUpdatedResponse.error)
			handleError(lastUpdatedResponse)
		}

		if (lastUpdatedResponse.data) {
			const lastUpdated = new Date(lastUpdatedResponse.data.last_updated)
			if (Date.now() - lastUpdated.getTime() < 1000 * 60 * 10) {
				const renewableAt = new Date(lastUpdated)
				renewableAt.setMinutes(renewableAt.getMinutes() + 30)

				setResponseStatus(event, 202)
				return {
					message: 'Already renewed.',
					last_updated: lastUpdated.toISOString(),
					renewable_at: renewableAt.toISOString(),
				}
			}
		}

		const { gameName, tagLine } = await riotFetch<Account>(
			event,
			Region.EUROPE,
			`/riot/account/v1/accounts/by-puuid/${puuid}`,
		)

		const { profileIconId } = await riotFetch<Summoner>(
			event,
			Platform.EUW1,
			`/lol/summoner/v4/summoners/by-puuid/${puuid}`,
		)

		const upsertPlayerResponse = await client.from('player')
			.upsert({
				puuid,
				game_name: gameName,
				tag_line: tagLine,
				profile_icon_id: profileIconId,
			})
			.select('puuid, game_name, tag_line, profile_icon_id')
			.single()

		if (upsertPlayerResponse.error) {
			event.context.errors.push(upsertPlayerResponse.error)
			handleError(upsertPlayerResponse)
		}

		return upsertPlayerResponse.data
	},
})
