/**
 * Accepts a puuid and updates the database with riot api information (name, summoner icon)
 */
import { z } from 'zod'
import type { IFetchError } from 'ofetch'

import { serverSupabaseServiceRole } from '#supabase/server'

import handleError from '~/server/utils/handleError'

import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'
import { Platform, Region, riotFetch } from '~/server/utils/riotFetch'

const puuidSchema = z.string().length(78)

interface RiotError {
	status: {
		message: string
		status_code: number
	}
}

interface Account {
	puuid: string
	gameName: string
	tagLine: string
}

interface Summoner {
	accountId: string
	profileIconId: number
	revisionDate: number
	id: string
	puuid: string
	summonerLevel: number
}

/**
 * Accepts list of puuids to remove/add to team
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const client = serverSupabaseServiceRole(event)

		const puuid = encodeURIComponent(puuidSchema.parse(getRouterParam(event, 'puuid')))

		const { gameName, tagLine } = await riotFetch<Account>(
			Region.EUROPE,
			`/riot/account/v1/accounts/by-puuid/${puuid}`,
		).catch((error: IFetchError<RiotError>) => {
			throw createError({
				statusCode: error.data?.status.status_code,
				statusMessage: error.data?.status.message.split(' - ')[0],
				message: error.data?.status.message.split(' - ')[1] ?? '',
			})
		})

		const { profileIconId } = await riotFetch<Summoner>(
			Platform.BR1,
			`/lol/summoner/v4/summoners/by-puuid/${puuid}`,
		).catch((error: IFetchError<RiotError>) => {
			throw createError({
				statusCode: error.data?.status.status_code,
				statusMessage: error.data?.status.message.split(' - ')[0],
				message: error.data?.status.message.split(' - ')[1] ?? '',
			})
		})

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
