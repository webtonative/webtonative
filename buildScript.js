const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
delete packageJson.private;
fs.writeFileSync("build/package.json",JSON.stringify(packageJson,null,4))