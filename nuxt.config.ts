// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxtjs/supabase', '@nuxt/eslint', 'nuxt-openapi-docs-module'],

	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],
	devtools: { enabled: true },

	app: {
		head: {
			link: [
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{ rel: 'preconnect', href: 'https://fonts.gstatic.com' },
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght,GRAD,XOPQ,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC@8..144,25..151,100..1000,-200..150,27..175,25..135,649..854,-305..-98,560..788,416..570,528..760&display=swap',
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
				},
				{ rel: 'icon', type: 'image/png', href: '/favicon32x32.png' },
			],
		},
	},
	css: ['normalize.css', '~/assets/main.scss', '~/assets/fonts.scss'],

	runtimeConfig: {
		riotGamesApiKey: '',
	},

	compatibilityDate: '2024-12-29',

	typescript: {
		typeCheck: true,
		strict: true,
		tsConfig: {
			compilerOptions: {
				strict: true,
				strictNullChecks: true,
				noImplicitAny: true,
				noImplicitThis: true,
				alwaysStrict: true,
			},
		},
	},

	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
			},
		},
	},

	supabase: {
		redirect: false,
	},
})
