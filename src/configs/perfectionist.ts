import { interopDefault } from "@antfu/eslint-config";

import { FlatConfig } from "../types";

const defaultOptions = {
	"ignore-case": true,
	type: "natural",
};

export interface PerfectionistESLintConfigBuilderOptions {
	/** @default false */
	isInEditor?: boolean;
	/** @default false */
	warningSortingInEditor?: boolean;
}

export async function perfectionist({
	isInEditor = false,
	warningSortingInEditor = false,
}: PerfectionistESLintConfigBuilderOptions): Promise<FlatConfig[]> {
	const [noAutoFixESLintPlugin, perfectionistESLintPlugin] = await Promise.all(
		[
			// @ts-expect-error No type declaration
			import("eslint-plugin-no-autofix"),
			// @ts-expect-error No type declaration
			import("eslint-plugin-perfectionist"),
		].map(interopDefault),
	);

	return [
		{
			name: "pcp/perfectionist",
			plugins: {
				"no-autofix": noAutoFixESLintPlugin,
				perfectionist: perfectionistESLintPlugin,
			},
			rules: {
				"perfectionist/sort-array-includes": [
					"error",
					{
						...defaultOptions,
						"spread-last": true,
					},
				],
				"perfectionist/sort-enums": ["error", defaultOptions],
				"perfectionist/sort-intersection-types": ["error", defaultOptions],
				"perfectionist/sort-maps": ["error", defaultOptions],
				"perfectionist/sort-union-types": [
					"error",
					{
						...defaultOptions,
						"nullable-last": true,
					},
				],
			},
		},
		...(warningSortingInEditor && isInEditor ? [noAutoFixRulesConfig] : []),
	];
}

const defaultPerfectionistSortObjectRuleOptions = {
	...defaultOptions,
	"custom-groups": {
		id: "id",
	},
	groups: ["id", "unknown"],
};

const noAutoFixRulesConfig: FlatConfig = {
	name: "pcp/perfectionist/no-autofix",
	rules: {
		"no-autofix/perfectionist/sort-interfaces": [
			"warn",
			defaultPerfectionistSortObjectRuleOptions,
		],
		"no-autofix/perfectionist/sort-object-types": [
			"warn",
			defaultPerfectionistSortObjectRuleOptions,
		],
		"no-autofix/perfectionist/sort-objects": [
			"warn",
			defaultPerfectionistSortObjectRuleOptions,
		],
	},
};
