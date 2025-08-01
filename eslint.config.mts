// @ts-check
import tseslint from 'typescript-eslint'
import withNuxt from './.nuxt/eslint.config.mjs'

const languageOptions = {
	parserOptions: {
		parser: tseslint.parser,
		projectService: true,
		tsconfigRootDir: import.meta.dirname,
	},
}

export default withNuxt()
	.prepend({
		ignores: [
			'types/database-generated.types.ts',
			'types/riot_schema.d.ts',
		],
	})
	// @ts-expect-error - We are mixing two libraries but this works
	.append(...tseslint.configs.strictTypeChecked.toSpliced(0, 1), tseslint.configs.stylisticTypeChecked[2])
	.override('typescript-eslint/eslint-recommended', { languageOptions })
	.override('typescript-eslint/strict-type-checked', {
		rules: {
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
		languageOptions,
	})
	.override('typescript-eslint/stylistic-type-checked', { languageOptions })
