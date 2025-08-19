import { resolve } from 'path';
import devtoolslsJson from 'vite-plugin-devtools-json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxtjs/supabase', '@nuxt/eslint'],
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
				{
					rel: 'preconnect',
					href: 'https://fonts.googleapis.com',
				},
				{
					rel: 'preconnect',
					href: 'https://fonts.gstatic.com',
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght,GRAD,XOPQ,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC@8..144,25..151,100..1000,-200..150,27..175,25..135,649..854,-305..-98,560..788,416..570,528..760&display=swap',
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
				},
				{
					rel: 'icon',
					type: 'image/png',
					href: '/favicon32x32.png',
				},
			],
		},
	},
	css: ['normalize.css', '~/assets/main.scss', '~/assets/fonts.scss'],

	runtimeConfig: {
		alphabets: { imageIds: '' },
		db: {
			url: '',
			host: '',
			port: '',
			username: '',
			name: '',
			password: '',
		},
		siteURL: '',
		backendBaseURL: '',
		riotGamesApiKey: '',
	},

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
		'@server': resolve(__dirname, 'server'),
		'@types': resolve(__dirname, 'server/@types'),
	},

	devServer: {
		https: {
			key: './localhost.key',
			cert: './localhost.crt',
		},
	},
	future: { compatibilityVersion: 4 },

	experimental: {
		decorators: true,
	},

	compatibilityDate: '2025-06-09',

	nitro: {
		esbuild: {
			options: {
				tsconfigRaw: {
					compilerOptions: {
						experimentalDecorators: true,
						// @ts-expect-error I am testing if this makes any difference.
						emitDecoratorMetadata: true,
						esModuleInterop: true,
					},
				},
			},
		},
		typescript: {
			tsConfig: {
				compilerOptions: {
					target: 'ES2022',
					declaration: true,
					strict: true,
					strictNullChecks: true,
					noImplicitAny: true,
					noImplicitThis: true,
					alwaysStrict: true,
					noUncheckedIndexedAccess: true,
					experimentalDecorators: true,
					emitDecoratorMetadata: true,
					esModuleInterop: true,
				},
			},
		},
		experimental: {
			openAPI: true,
			asyncContext: true,
		},
		openAPI: {
			meta: {
				title: 'TournamentStats',
				description: 'REST API for accessing and modifying tournaments, teams, player and all their stats.',
				version: '1.0',
			},
			route: '/api/docs/openapi.json',
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
		build: { sourcemap: true },
	},

	typescript: {
		typeCheck: 'build',
		strict: true,
		tsConfig: {
			include: ['../eslint.config.mts'],
			compilerOptions: {
				strict: true,
				strictNullChecks: true,
				noImplicitAny: true,
				noImplicitThis: true,
				alwaysStrict: true,
				noUncheckedIndexedAccess: true,
				noErrorTruncation: true,
			},
		},
	},

	telemetry: { enabled: false },

	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				semi: true,
				quotes: 'single',
			},
		},
	},

	supabase: {
		redirect: false,
		clientOptions: {
			auth: {
				flowType: 'pkce',
				storageKey: 'tstats-auth',
			},
		},
		cookiePrefix: 'tstats-auth',
	},
});
