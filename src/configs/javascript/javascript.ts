import { interopDefault } from "@antfu/eslint-config";
import globals from "globals";

import { FlatConfig } from "../../types";
import { javascriptImport } from "../import";
import { rules } from "./rules";
import { JavascriptESLintConfigBuilderOptions } from "./types";

export async function javascript({
	enableImport = true,
	env,
	files,
	isInEditor = false,
}: JavascriptESLintConfigBuilderOptions): Promise<FlatConfig[]> {
	const { browser = true, greasemonkey = false, node = true } = env ?? {};
	const unusedImportsESLintPlugin = await interopDefault(
		// @ts-expect-error No type declaration
		import("eslint-plugin-unused-imports"),
	);

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
		...(enableImport ? await javascriptImport() : []),
	];
}
