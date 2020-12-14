import Parse from "parse/node.js";

let parseInstance = null;

/**
 * Ensure that we get a properly initialized Parse instance
 * (only on server side because calling Parse from the front-end is of course forbidden)
 * @return {Parse}
 */
export const getParseInstance = () => {
	if (typeof window === "undefined" && !parseInstance) {
		// if (process.env.NODE_ENV === "test") {
		// 	// Help us for the test
		// 	console.log("Loading the environment variables");
		// 	loadEnvConfig();
		// }
		const { PARSE_APP_ID, PARSE_JS_KEY, PARSE_SERVER_URL } = process.env;

		if (!PARSE_APP_ID || !PARSE_JS_KEY || !PARSE_SERVER_URL) {
			throw new Error(
				"Couldn't find the environment variables for the Parse SDK initialization"
			);
		}
		Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
		Parse.serverURL = PARSE_SERVER_URL;
		parseInstance = Parse;
	}

	return parseInstance;
};
