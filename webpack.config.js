const production = process.env.NODE_ENV == "production";
const path = require("path");


module.exports = {
  mode: production ? "production" : "development",
  ...(!production && { devtool: "source-map" }),
  entry: {
    'webtonative': "./client.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: `[name]${production ? ".min" : ""}.js`,
    environment : {
			arrowFunction: false,
			bigIntLiteral: false,
			const: false,
			destructuring: false,
			dynamicImport: false,
			forOf: false,
			module: false,
		}
  },
  module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			options: {
				presets:[
          ['@babel/preset-env',{
            modules:false
          }]
        ]
			}
		}]
	},
};
