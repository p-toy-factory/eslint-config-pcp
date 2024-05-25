import type { Linter } from "eslint";

export function replacePluginWithKeys(config: Linter.FlatConfig) {
	return config.plugins
		? {
				...config,
				plugins: Object.keys(config.plugins),
			}
		: config;
}
