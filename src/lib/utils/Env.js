import Env from "@next/env";
import baseDir from "../../../dirname.js"; // HACK TO AVOID READING import.meta.url

/**
 * Load the .env files
 * (useful for tests and scripts that are not executed inside the Next application)
 */
export const loadEnv = () => {
	if (process.env.PRISMIC_CLIENT_ID) return;
	// How can we know for sure the project root outside next..
	Env.loadEnvConfig(baseDir);
};

export default {
	loadEnv
};
