import eslint from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import * as parser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
	{
		ignores: ["**/node_modules/**", "**/dist/**"],
		ignorePatterns: ["mikro-orm.config.js"]
	},
	{
		languageOptions: {
			parser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
				sourceType: "module"
			},
			globals: {
				...globals.node,
				...globals.jest
			}
		},
		plugins: {
			"@typescript-eslint": ts
		},
		rules: {
			...eslint.configs.recommended.rules,
			...ts.configs.recommended.rules,
			...ts.configs["recommended-type-checked"].rules,

			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-argument": "off",

			eqeqeq: ["warn", "always"],
			"no-param-reassign": "warn",
			"@typescript-eslint/no-non-null-assertion": "warn",
			"@typescript-eslint/consistent-type-imports": "off",
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"prettier/prettier": [
				"error",
				{
					useTabs: true,
					tabWidth: 4,
					singleQuote: false,
					semi: true,
					trailingComma: "none",
					printWidth: 100
				}
			]
		}
	},
	{
		files: ["**/*.spec.ts", "**/*.test.ts"],
		languageOptions: {
			parser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
				sourceType: "module"
			}
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/unbound-method": "off",
			"@typescript-eslint/no-unsafe-call": "off"
		}
	},
	prettier
];
