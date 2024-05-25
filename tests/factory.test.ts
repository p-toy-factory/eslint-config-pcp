import { basename } from "node:path";

import { describe, expect, test } from "vitest";

import { buildConfig } from "../src/factory";
import { replacePluginWithKeys } from "./utils";

describe("factory", () => {
	test("build config with all options", async () => {
		const config = await buildConfig({
			import: true,
			isInEditor: true,
			perfectionist: true,
			react: true,
			storybook: true,
			typescript: true,
		});

		const configWithoutPluginsImpl = config.map((item) =>
			replacePluginWithKeys(item),
		);

		await expect(configWithoutPluginsImpl).toMatchFileSnapshot(
			`./__snapshots__/${basename(import.meta.filename)}.full-config.js.snap`,
		);
	});
});
