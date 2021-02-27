import { merge } from "../lib/utils/deepMerge.js";
import ParseNode from "parse/node.js";
import ApiError from "../lib/ApiError.js";
import { loadEnv } from "../lib/utils/Env.js";

// Now let's add every model to the Parse object
import "./Adherent.js";
import "./Adhesion.js";
import "./Parameters.js";

let parseInstance = null;

/**
 * A handfull of static utility methods added on the Parse object
 */
const ParseExtensions = {
	/**
	 * Retrieves a single object (the field should be a unique key)
	 * @param {String} className
	 * @param {String} fieldName
	 * @param {Any} value
	 * @return {ParseObject}
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
	},

	/**
	 *
	 * @param {Parse.Query} query
	 * @param {Map} params
	 */
	addQueryParameters: (query, params) => {
		if (typeof params === "object" && !params instanceof Map) {
			params = new Map(Object.entries(params));
		}
		for ([key, value] of params) {
			query.equalTo(key, value);
		}
		return query;
	}
};

export const Parse = merge(ParseNode, ParseExtensions);

/**
 * Ensure that we get a properly initialized Parse instance
 * (only on server side because calling Parse from the front-end is of course forbidden)
 * @return {Parse}
 */
export const getParseInstance = () => {
	if (typeof window !== "undefined") {
		throw new Error(
			"getParseInstance cannot be called on the front-end ! Use APIClient instead."
		);
	} else if (!parseInstance) {
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

	return parseInstance;
};
