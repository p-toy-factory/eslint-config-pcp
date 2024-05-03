import { FlatConfig } from "../types";
import { importESLintPlugin, simpleImportSortESLintPlugin } from "./plugins";

export function javascriptImport(): FlatConfig[] {
	return [
		{
			name: "pinkchampagne:javascript:import",
			plugins: {
				import: importESLintPlugin,
				"simple-import-sort": simpleImportSortESLintPlugin,
			},
			rules: {
				"import/first": "error",
				"import/newline-after-import": "off", // TODO: Broken in eslint v9
				"import/no-duplicates": "off", // TODO: Broken in eslint v9
				"simple-import-sort/exports": "error",
				"simple-import-sort/imports": "error",
			},
		},
	];
}

export function typescriptImport(): FlatConfig[] {
	return [
		{
			name: "pinkchampagne:typescript:import",
			plugins: {
				import: importESLintPlugin,
			},
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			...importESLintPlugin.configs.typescript,
		},
		{
			name: "pinkchampagne:typescript:import:overrides",
			settings: {
				// https://github.com/un-es/eslint-plugin-i#typescript
				"import/resolver": {
					node: true,
					typescript: true,
				},
			},
		},
	];
}
