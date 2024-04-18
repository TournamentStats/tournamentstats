// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxtjs/supabase'],
	devtools: { enabled: true },
	typescript: {
		strict: true
	},
	supabase: {
		redirectOptions: {
			login: '/login',
			callback: '/confirm',
			exclude: ['*']
		}
	}
})
