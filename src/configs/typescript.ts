/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import process from "node:process";

import { GLOB_TS, GLOB_TSX, interopDefault } from "@antfu/eslint-config";

import { FlatConfig } from "../types";
import { typescriptImport } from "./import";

export interface TypescriptESLintConfigBuilderOptions {
	/** @default true */
	enableSortImport?: boolean;
	files?: string[];
}

export async function typescript({
	enableSortImport = true,
	files,
}: TypescriptESLintConfigBuilderOptions = {}): Promise<FlatConfig[]> {
	const [typescriptESLintPlugin, typescriptESLintParser] = await Promise.all([
		interopDefault(import("@typescript-eslint/eslint-plugin")),
		interopDefault(
			// @ts-expect-error No type declarations
			import("@typescript-eslint/parser"),
		),
	]);
	const configs = typescriptESLintPlugin.configs;
	return [
		{
			name: "pcp/typescript",
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
		...(enableSortImport ? await typescriptImport() : []),
	];
}
