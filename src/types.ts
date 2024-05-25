import { jsonc } from "@antfu/eslint-config";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";

import type { JavascriptESLintConfigBuilderOptions } from "./configs/javascript";
import type { PerfectionistESLintConfigBuilderOptions } from "./configs/perfectionist";
import { ReactESLintConfigBuilderOptions } from "./configs/react";
import { StorybookESLintConfigBuilderOptions } from "./configs/storybook";
import type { TypescriptESLintConfigBuilderOptions } from "./configs/typescript";

export interface FlatConfig extends Linter.FlatConfig {
	name?: string;
}

export interface BuildConfigOptions {
	gitignore?: boolean | FlatGitignoreOptions;
	/** @default true */
	import?: boolean;
	isInEditor?: boolean;
	javascript?: JavascriptESLintConfigBuilderOptions;
	/** @default true */
	jsonc?: boolean | Parameters<typeof jsonc>[0];
	/** @default true */
	node?: boolean;
	/** @default false */
	perfectionist?: boolean | PerfectionistESLintConfigBuilderOptions;
	react?: boolean | ReactESLintConfigBuilderOptions;
	/**
	 * @default true
	 * @requires `jsonc` is `true`
	 */
	sortPackageJson?: boolean;
	/**
	 * @default true
	 * @requires `jsonc` is `true`
	 */
	sortTsconfig?: boolean;
	/**
	 * @default false
	 */
	storybook?: boolean | StorybookESLintConfigBuilderOptions;
	typescript?: boolean | TypescriptESLintConfigBuilderOptions;
	/** @default true */
	unicorn?: boolean;
}
