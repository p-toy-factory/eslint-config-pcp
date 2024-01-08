import {
	GLOB_JSX,
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
	files,
	overrides,
}: ReactESLintConfigBuilderOptions = {}): Promise<FlatConfig[]> {
	const eslintPluginReactHooks = await interopDefault(
		// @ts-expect-error no types
		import("eslint-plugin-react-hooks"),
	);

	return [
		{
			name: "pinkchampagne:react",
			files: files ?? [GLOB_JSX, GLOB_TSX],
			plugins: {
				"react-hooks": eslintPluginReactHooks,
			},
			rules: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				...eslintPluginReactHooks.configs.recommended.rules,
				...overrides,
			},
		},
	];
}
