// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
	rules: {
		'vue/html-indent': ['error', 'tab'],
		'@stylistic/semi': ['error', 'never'],
		'@stylistic/indent': ['error', 'tab'],
		'no-undef': ['error'],
		'@typescript-eslint/no-unused-vars': ['warn', {
			vars: 'all',
			args: 'after-used',
			caughtErrors: 'all',
			ignoreRestSiblings: false,
			reportUsedIgnorePattern: false,
			varsIgnorePattern: '^_',
			argsIgnorePattern: '^_',
		}],
	},
	languageOptions: {
		globals: {
			defineNuxtConfig: 'readable',
		},
	},

},
)
