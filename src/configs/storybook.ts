import {
	interopDefault,
	OptionsFiles,
	OptionsOverrides,
} from "@antfu/eslint-config";

import { FlatConfig } from "../types";

export interface StorybookESLintConfigBuilderOptions
	extends OptionsFiles,
		OptionsOverrides {}

export async function storybook({
	files,
	overrides,
}: StorybookESLintConfigBuilderOptions = {}): Promise<FlatConfig[]> {
	const eslintPluginStorybook = await interopDefault(
		// @ts-expect-error no types
		import("eslint-plugin-storybook"),
	);
	const [config1, config2] =
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		eslintPluginStorybook.configs.recommended.overrides;

	return [
		{
			name: "pcp/storybook",
			files: files ?? ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
			plugins: {
				storybook: eslintPluginStorybook,
			},
			rules: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				...config1.rules,
				...overrides,
			},
		},
		// TODO: name
		config2,
	];
}
