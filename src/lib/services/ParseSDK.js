import ApiError from "@lib/ApiError.js";
import Parse from "parse/node.js";
import { loadEnv } from "../utils/Env.js";

let parseInstance = null;

/**
 * Ensure that we get a properly initialized Parse instance
 * (only on server side because calling Parse from the front-end is of course forbidden)
 * @return {Parse}
 */
export const getParseInstance = () => {
	if (typeof window === "undefined" && !parseInstance) {
		// Manually load the environment variables for the test
		if (process.env.NODE_ENV === "test") {
			loadEnv();
		}
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

	return Object.assign(parseInstance, ParseExtensions);
};

const ParseExtensions = {
	/**
	 *
	 * @param {*} className
	 * @param {*} fieldName
	 * @param {*} value
	 */
	retrieveByUniqueKey: async (className, fieldName, value) => {
		try {
			const query = new Parse.Query(className);
			query.equalTo(fieldName, value);
			return await query.first();
		} catch (err) {
			console.error(err);
			throw new ApiError(
				err.code || 500,
				`Couldn't retrieve ${className}('${value}') : ${err.message}`
			);
		}
	}
};
