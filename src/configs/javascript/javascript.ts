import globals from "globals";

import { FlatConfig } from "../../types";
import { javascriptImport } from "../import";
import { unusedImportsESLintPlugin } from "../plugins";
import { rules } from "./rules";
import { JavascriptESLintConfigBuilderOptions } from "./types";

export async function javascript({
	enableSortImport = true,
	env,
	files,
	isInEditor = false,
}: JavascriptESLintConfigBuilderOptions): Promise<FlatConfig[]> {
	const { browser = true, greasemonkey = false, node = true } = env ?? {};
	return [
		{
			name: "pcp/javascript",
			files,
			languageOptions: {
				globals: {
					...(browser && globals.browser),
					...(greasemonkey && globals.greasemonkey),
					...(node && globals.node),
				},
			},
			linterOptions: {
				reportUnusedDisableDirectives: true,
			},
			rules,
		},
		// eslint-plugin-unused-imports
		{
			name: "pcp/javascript/unused-imports",
			plugins: {
				"unused-imports": unusedImportsESLintPlugin,
			},
			rules: {
				"unused-imports/no-unused-imports": isInEditor ? "off" : "error",
			},
		},
		...(enableSortImport ? await javascriptImport() : []),
	];
}
