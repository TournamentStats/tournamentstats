// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
	rules: {
		'vue/html-indent': ['error', 'tab'],
		'@stylistic/semi': ['error', 'never'],
		'@stylistic/indent': ['error', 'tab'],
	},
})
