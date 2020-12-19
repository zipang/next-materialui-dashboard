module.exports = {
	stories: [
		"../src/components/**/*.stories.mdx",
		"../src/components/**/*.stories.@(js|jsx|ts|tsx)"
		// "../src/stories/**/*.stories.mdx",
		// "../src/stories/**/*.stories.@(js|jsx|ts|tsx)"
	],
	reactOptions: {
		fastRefresh: true
	},
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"storybook-addon-material-ui"
	],
	webpackFinal: async (baseConfig) => {
		// merge whatever from nextConfig into the webpack config storybook will use
		// this include important things like aliases on @components, @lib...
		const nextConfig = require("../next.config.js");
		const mergedWebpackConfig = nextConfig.webpack(baseConfig);
		console.dir(mergedWebpackConfig);
		return mergedWebpackConfig;
	}
};
