// @ts-check
import { buildConfig } from "./dist/index.js";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	...(await buildConfig({
		perfectionist: {
			warningSortingInEditor: true,
		},
	})),
	{
		rules: {
			"no-autofix/perfectionist/sort-objects": [
				"warn",
				{
					"custom-groups": {
						name: "name",
					},
					groups: ["name", "unknown"],
				},
			],
		},
	},
];
