module.exports = {
	env: {
		es2021: true,
		node: true
	},
	extends: [
		'plugin:@typescript-eslint/recommended',
		'standard'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module'
	},
	plugins: [
		'@typescript-eslint'
	],
	rules: {
		semi: [2, 'always'],
		indent: ['error', 'tab'],
		'no-tabs': 'off',
		quotes: 'off',
		// 'semi-style': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 0
	}
};
