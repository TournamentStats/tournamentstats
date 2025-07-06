import { resolve } from 'path'
import devtoolslsJson from 'vite-plugin-devtools-json'

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
		databaseURL: '',
		siteURL: '',
		backendBaseURL: '',
		riotGamesApiKey: '',
	},

	srcDir: 'app/',

	alias: {
		'~': resolve(__dirname, 'app'),
		'@': resolve(__dirname, 'app'),
		'~~': resolve(__dirname),
		'@@': resolve(__dirname),
		'#shared': resolve(__dirname, 'shared'),
		'assets': resolve(__dirname, 'assets'),
		'public': resolve(__dirname, 'public'),
		'#build': resolve(__dirname, '.nuxt'),
		'#internal/nuxt/paths': resolve(__dirname, '.nuxt/paths.mjs'),
		'@utils': resolve(__dirname, 'app/server/utils'),
	},
	build: {
		transpile: ['riot-games-fetch-typed'],
	},

	compatibilityDate: '2025-06-09',

	nitro: {
		imports: {
			dirs: ['server/utils'],
		},
		experimental: {
			openAPI: true,
		},
		openAPI: {
			meta: {
				title: 'TournamentStats',
				description: 'REST API for accessing and modifying tournaments, teams, player and all their stats.',
				version: '1.0',
			},
			route: '/_docs/openapi.json',
			production: 'prerender',
			ui: {
				scalar: {
					theme: 'default',
					layout: 'modern',
					route: '/api/docs',
				},
			},
		},
	},

	vite: {
		plugins: [
			devtoolslsJson(),
		],
	},

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
		clientOptions: {
			auth: {
				flowType: 'pkce',
			},
		},
		cookiePrefix: 'tstats-auth',
	},
})
