const fs = require("fs");
import path from "path";

// Copy README.md to build folder
fs.copyFileSync("README.md", "build/README.md");

// Read package.json, remove private flag, and write to build folder
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
delete packageJson.private;

const buildPath = path.resolve("build");

const exportsMap = {
	".": {
		import: "./index.js",
		types: "./index.d.ts",
	},
};

const entries = fs.readdirSync(buildPath, { withFileTypes: true });

for (const entry of entries) {
	if (entry.isDirectory()) {
		const name = entry.name;
		exportsMap[`./${name}`] = {
			import: `./${name}/index.js`,
			types: `./${name}/index.d.ts`,
		};
	}
}

packageJson.exports = exportsMap;

// Write the modified package.json to build folder
fs.writeFileSync("build/package.json", JSON.stringify(packageJson, null, 4));
