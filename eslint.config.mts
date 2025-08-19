import tseslint from 'typescript-eslint';
import withNuxt from './.nuxt/eslint.config.mjs';
import type { Linter } from 'eslint';

const languageOptions: Linter.LanguageOptions = {
	parserOptions: {
		parser: tseslint.parser,
		projectService: true,
		tsconfigRootDir: import.meta.dirname,
	},
};

export default withNuxt()
	// @ts-expect-error - We are mixing two libraries but this works
	.append(...tseslint.configs.strictTypeChecked.toSpliced(0, 1), tseslint.configs.stylisticTypeChecked[2])
	.override('typescript-eslint/eslint-recommended', { languageOptions })
	.override('typescript-eslint/strict-type-checked', {
		rules: {
			'import/consistent-type-specifier-style': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
		languageOptions,
	})
	.override('typescript-eslint/stylistic-type-checked', {
		rules: {
			'@stylistic/object-curly-newline': ['error', { multiline: true }],
			'@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
			'@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
		},
		languageOptions,
	});
