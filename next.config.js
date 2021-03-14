// @ts-nocheck
// next.config.js
const { resolve } = require("path");

module.exports = {
	reactStrictMode: true,
	redirects: async () => [
		{
			source: "/",
			destination: "/login",
			permanent: true
		}
	],
	// Enable CORS
	headers: async () => {
		return [
			{
				// matching all API routes
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,OPTIONS,PATCH,DELETE,POST,PUT"
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
					}
				]
			}
		];
	},
	webpack: (config, options) => {
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
	}
};
