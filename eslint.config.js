import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
	pluginJs.configs.recommended,

	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	pluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
				ecmaVersion: 2022,
				sourceType: "module",
			},
		},
		rules: {
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-debugger": "warn",
			"no-undef": "error",
			"no-implicit-globals": "error",
			eqeqeq: ["error", "always"],
			yoda: "error",
			"@typescript-eslint/explicit-function-return-type": [
				"warn",
				{
					allowExpressions: true,
				},
			],
		},
		ignores: [
			"node_modules",
			"dist/",
			"build/",
			"eslint.config.js",
			"prettier.config.js",
			".prettierignore",
			"vite.config.ts",
			"dist/**/*.js",
			"src/*.js",
		],
	},
];
