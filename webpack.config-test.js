// @ts-nocheck
// next.config.js
const { resolve } = require("path");

module.exports = (config, options) => {
	config.module.rules.push({
		test: /\.md$/,
		use: [
			{
				loader: "gray-matter-loader",
				options: {}
			}
		]
	});

	// Define some nice aliases (the same as in jsconfig.json)
	config.resolve.alias = {
		...config.resolve.alias,
		"@lib": resolve(__dirname, "src/lib/"),
		"@models": resolve(__dirname, "src/models/"),
		"@components": resolve(__dirname, "src/components/"),
		"@config": resolve(__dirname, "src/config/"),
		"@forms": resolve(__dirname, "src/components/forms/"),
		"@api": resolve(__dirname, "src/pages/api")
	};

	// Fixes npm packages that depend on `fs` module
	config.node = {
		fs: "empty",
		child_process: "empty"
	};

	return config;
};
