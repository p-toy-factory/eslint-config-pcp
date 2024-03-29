import fs from "node:fs";
import { env } from "node:process";

import {
	ignores,
	jsonc,
	node,
	sortPackageJson,
	sortTsconfig,
	unicorn,
} from "@antfu/eslint-config";
import { isCI } from "ci-info";
import gitignore from "eslint-config-flat-gitignore";
import { isPackageExists } from "local-pkg";

import { javascript } from "./configs/javascript";
import { perfectionist } from "./configs/perfectionist";
import { react } from "./configs/react";
import { storybook } from "./configs/storybook";
import { typescript } from "./configs/typescript";
import { BuildConfigOptions, FlatConfig } from "./types";

export { BuildConfigOptions } from "./types";

function resolveOptions<T extends object>(options?: T | true): T | undefined {
	return typeof options === "boolean" ? undefined : options;
}

export async function buildConfig(
	options: BuildConfigOptions = {},
): Promise<FlatConfig[]> {
	const hasEditorEnv = Boolean(env.VSCODE_PID || env.JETBRAINS_IDE);
	const {
		gitignore: enableGitignore = fs.existsSync(".gitignore"),
		isInEditor = !isCI && hasEditorEnv,
		javascript: javascriptOptions,
		jsonc: enableJsonc = true,
		node: enableNode = true,
		perfectionist: enablePerfectionist = false,
		react: enableReact = isPackageExists("react"),
		sortImport: enableSortImport = true,
		sortPackageJson: enableSortPackageJson = true,
		sortTsconfig: enableSortTsconfig = true,
		storybook: enableStorybook = false,
		typescript: enableTypeScript = isPackageExists("typescript"),
		unicorn: enableUnicorn = true,
	} = options;

	if (!enableJsonc && (enableSortPackageJson || enableSortTsconfig)) {
		throw new TypeError(
			"`sortPackageJson` and `sortTsconfig` require `jsonc` is `true`",
		);
	}

	const configs = [
		ignores(),
		enableGitignore && gitignore(resolveOptions(enableGitignore)),

		javascript({ enableSortImport, isInEditor, ...javascriptOptions }),
		enableNode && node(),
		enablePerfectionist &&
			perfectionist({ isInEditor, ...resolveOptions(enablePerfectionist) }),
		enableUnicorn && unicorn(),

		enableTypeScript &&
			typescript({
				enableSortImport,
				...resolveOptions(enableTypeScript),
			}),

		enableReact && react(resolveOptions(enableReact)),

		enableJsonc &&
			jsonc({
				stylistic: false,
				...resolveOptions(enableJsonc),
			}),
		enableSortPackageJson && sortPackageJson(),
		enableSortTsconfig && sortTsconfig(),
		enableStorybook && storybook(resolveOptions(enableStorybook)),
	] as Array<
		boolean | FlatConfig | FlatConfig[] | Promise<FlatConfig | FlatConfig[]>
	>;

	return (await Promise.all(configs))
		.flat()
		.filter((item): item is FlatConfig => typeof item === "object")
		.map((config) => {
			// Remove `files` property if it's undefined
			const { files, ...restConfig } = config;
			return files ? config : restConfig;
		});
}
