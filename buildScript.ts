const fs = require("fs");
const path = require("path");

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

function addExports(dir, prefix = "") {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const folderName = entry.name;
			const rel = prefix ? `${prefix}/${folderName}` : folderName;

			const indexJs = path.join(dir, folderName, "index.js");
			const indexDts = path.join(dir, folderName, "index.d.ts");

			if (fs.existsSync(indexJs)) {
				exportsMap[`./${rel}`] = {
					import: `./${rel}/index.js`,
					types: `./${rel}/index.d.ts`,
				};
			}

			addExports(path.join(dir, folderName), rel);
		}
	}
}

addExports(buildPath);

packageJson.exports = exportsMap;
fs.writeFileSync(path.join(buildPath, "package.json"), JSON.stringify(packageJson, null, 4));
