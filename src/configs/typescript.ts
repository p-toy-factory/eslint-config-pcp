import { GLOB_TS, GLOB_TSX } from "@antfu/eslint-config";

import { FlatConfig } from "../types";
import { typescriptImport } from "./import";
import { typescriptESLintParser, typescriptESLintPlugin } from "./plugins";

export interface TypescriptESLintConfigBuilderOptions {
	/** @default true */
	enableSortImport?: boolean;
	files?: string[];
}

export function typescript({
	enableSortImport = true,
	files,
}: TypescriptESLintConfigBuilderOptions = {}): FlatConfig[] {
	return [
		{
			name: "pinkchampagne:typescript",
			files: files ?? [GLOB_TS, GLOB_TSX],
			languageOptions: {
				parser: typescriptESLintParser,
			},
			plugins: {
				"@typescript-eslint": typescriptESLintPlugin,
			},
			rules: {
				"@typescript-eslint/ban-ts-comment": [
					"error",
					{
						"ts-ignore": false,
						"ts-nocheck": false,
					},
				],

				/** @see https://typescript-eslint.io/rules/no-redeclare */
				"no-redeclare": "off",

				/** @see https://typescript-eslint.io/rules/no-unused-vars */
				"no-unused-vars": "off",
				"@typescript-eslint/no-unused-vars": "error",
			},
		},
		...(enableSortImport ? typescriptImport() : []),
	];
}
