 
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import process from "node:process";

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
	const configs = typescriptESLintPlugin.configs;
	return [
		{
			name: "pinkchampagne:typescript",
			files: files ?? [GLOB_TS, GLOB_TSX],
			languageOptions: {
				parser: typescriptESLintParser,
				parserOptions: {
					project: true,
					tsconfigRootDir: process.cwd(),
				},
			},
			plugins: {
				"@typescript-eslint": typescriptESLintPlugin,
			},
			rules: {
				...configs["eslint-recommended"].overrides[0].rules,
				...configs["recommended-type-checked"].rules,

				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-return": "off",

				/** @see https://typescript-eslint.io/rules/prefer-destructuring */
				"prefer-destructuring": "off",
				// eslint-disable-next-line no-autofix/perfectionist/sort-objects
				"@typescript-eslint/prefer-destructuring": [
					"error",
					{
						AssignmentExpression: {
							array: false,
							object: true,
						},
						VariableDeclarator: {
							array: false,
							object: false,
						},
					},
				],
			},
		},
		...(enableSortImport ? typescriptImport() : []),
	];
}
