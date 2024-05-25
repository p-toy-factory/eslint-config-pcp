import { interopDefault } from "@antfu/eslint-config";

import { FlatConfig } from "../types";

export async function javascriptImport(): Promise<FlatConfig[]> {
	const [importESLintPlugin, simpleImportSortESLintPlugin] = await Promise.all(
		[
			import("eslint-plugin-import-x"),
			import("eslint-plugin-simple-import-sort"),
		].map(interopDefault),
	);

	return [
		{
			name: "pcp/javascript/import",
			plugins: {
				// @ts-expect-error It works
				"import-x": importESLintPlugin,
				// @ts-expect-error It works
				"simple-import-sort": simpleImportSortESLintPlugin,
			},
			rules: {
				"import-x/first": "error",
				"import-x/newline-after-import": "error",
				"import-x/no-duplicates": "error",
				"simple-import-sort/exports": "error",
				"simple-import-sort/imports": "error",
			},
		},
	];
}

export async function typescriptImport(): Promise<FlatConfig[]> {
	const importESLintPlugin = await interopDefault(
		import("eslint-plugin-import-x"),
	);
	return [
		{
			name: "pcp/typescript/import",
			...importESLintPlugin.configs.typescript,
		},
	];
}
