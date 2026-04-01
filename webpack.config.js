const production = process.env.NODE_ENV == "production";
const path = require("path");
const fs = require("fs");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = packageJson.version;
module.exports = {
	mode: production ? "production" : "development",
	...(!production && { devtool: "source-map" }),
	entry: {
		webtonative: "./client.ts",
	},
	output: {
		path: path.resolve("./build"),
		filename: `[name]${production ? ".min" : ""}.js`,
		environment: {
			arrowFunction: false,
			bigIntLiteral: false,
			const: false,
			destructuring: false,
			dynamicImport: false,
			forOf: false,
			module: false,
		},
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								[
									"@babel/preset-env",
									{
										modules: false,
									},
								],
							],
						},
					},
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
};
