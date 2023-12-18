# eslint-config-pcp

## Usage

### Install

```
npm install eslint eslint-config-pcp
```

### Create config file

With "type": "module" in package.json (recommended):

```js
// eslint.config.js
import { buildConfig } from "eslint-config-pcp";

export default buildConfig();
```

With CJS:

```js
// eslint.config.js
const { buildConfig } = require("eslint-config-pcp");

module.exports = buildConfig();
```

### VS Code support

```json
{
	"eslint.experimental.useFlatConfig": true,
	// For workspaces
	"eslint.workingDirectories": [
		{
			"mode": "auto"
		}
	]
}
```
