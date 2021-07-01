import ParseNode from "parse/node.js";
import ApiError from "../lib/ApiError.js";
import { loadEnv } from "../lib/utils/Env.js";

// Now let's add every model to the Parse object

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
	 * @param {Object} params
	 */
	addQueryParameters: (query, params) => {
		if (!params) return query;
		for (let [key, value] of Object.entries(params)) {
			query.equalTo(key, value);
		}
		return query;
	}
};

export const Parse = Object.assign(ParseNode, ParseExtensions);

/**
 * Retrieves a complete list of ParseObjects that satisfy this query.
 * Using `eachBatch` under the hood to fetch all the valid objects.
 *
 * @param {object} options Valid options are:<ul>
 *   <li>batchSize: How many objects to yield in each batch (default: 100)
 *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
 *     be used for this request.
 *   <li>sessionToken: A valid session token, used for making a request on
 *       behalf of a specific user.
 * </ul>
 * @returns {Promise} A promise that is resolved with the results when
 * the query completes.
 */
Parse.Query.prototype.findAll = async function (options) {
	let result = [];
	await this.eachBatch((objects) => {
		result = [...result, ...objects];
	}, options);
	return result;
};

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
		// Manually load the environment variables for the test or scripts
		if (!process.env.PARSE_APP_ID) {
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
