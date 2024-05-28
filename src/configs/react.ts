import {
	GLOB_JS,
	GLOB_JSX,
	GLOB_TS,
	GLOB_TSX,
	interopDefault,
	OptionsFiles,
	OptionsOverrides,
} from "@antfu/eslint-config";

import { FlatConfig } from "../types";

export interface ReactESLintConfigBuilderOptions
	extends OptionsFiles,
		OptionsOverrides {}

export async function react({
	files: overrideFiles,
	overrides,
}: ReactESLintConfigBuilderOptions = {}): Promise<FlatConfig[]> {
	const files = overrideFiles ?? [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX];

	const [eslintPluginReactHooks, { default: eslintPluginReact }] =
		await Promise.all([
			// @ts-expect-error no types
			interopDefault(import("eslint-plugin-react-hooks")),
			import("@eslint-react/eslint-plugin"),
		]);

	return [
		{
			name: "pcp/react",
			files,
			plugins: {
				"react-hooks": eslintPluginReactHooks,
			},
			rules: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				...eslintPluginReactHooks.configs.recommended.rules,
				...overrides,
			},
		},
		{ files, ...eslintPluginReact.configs.recommended },
	];
}
