const fs = require('fs');

// Copy README.md to build folder
fs.copyFileSync("README.md", "build/README.md");

// Read package.json, remove private flag, and write to build folder
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
delete packageJson.private;

// Write the modified package.json to build folder
fs.writeFileSync("build/package.json", JSON.stringify(packageJson, null, 4));