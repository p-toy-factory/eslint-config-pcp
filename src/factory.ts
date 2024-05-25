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
		import: enableImport = true,
		isInEditor = !isCI && hasEditorEnv,
		javascript: javascriptOptions,
		jsonc: enableJsonc = true,
		node: enableNode = true,
		perfectionist: enablePerfectionist = false,
		react: enableReact = isPackageExists("react"),
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

	const configsGenerator = function* () {
		yield ignores();

		if (enableGitignore) {
			yield gitignore(resolveOptions(enableGitignore));
		}

		yield javascript({
			enableImport,
			isInEditor,
			...javascriptOptions,
		});

		if (enableNode) {
			yield node();
		}
		if (enablePerfectionist) {
			yield perfectionist({
				isInEditor,
				...resolveOptions(enablePerfectionist),
			});
		}
		if (enableUnicorn) {
			yield unicorn();
		}
		if (enableTypeScript) {
			yield typescript({
				enableImport,
				...resolveOptions(enableTypeScript),
			});
		}
		if (enableReact) {
			yield react(resolveOptions(enableReact));
		}
		if (enableJsonc) {
			yield jsonc({
				stylistic: false,
				...resolveOptions(enableJsonc),
			});
		}
		if (enableSortPackageJson) {
			yield sortPackageJson();
		}
		if (enableSortTsconfig) {
			yield sortTsconfig();
		}
		if (enableStorybook) {
			yield storybook(resolveOptions(enableStorybook));
		}
	};

	return (await Promise.all(Array.from(configsGenerator())))
		.flat()
		.map((config) => {
			if ("files" in config) {
				// Remove `files` property if it is not `string` or `string[]`
				const { files, ...restConfig } = config;
				return files ? config : restConfig;
			}
			return config;
		});
}
