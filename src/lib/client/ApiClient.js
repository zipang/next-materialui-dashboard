import "isomorphic-fetch";
import ApiError from "../ApiError.js";
import IncomingMessage from "http";

const APIClient = {};

const _DEFAULT_REQUEST_HEADERS = {
	Accept: "application/json",
	"Content-Type": "application/json"
};

/**
 * Extract the search params from and incoming HTTP GET request
 * @param {IncomingMessage} req
 * @return {URLSearchParams}
 */
export const getSearchParams = (req) =>
	new URL(req.url, `http://${req.headers.host}`).searchParams;

/**
 * Complete relative API URLs with the base site URL
 * that must exist as an environment variable
 * @param {String} apiEndpoint
 * @return {URL}
 */
export const buildURL = (apiEndpoint, params) => {
	let finalUrl;
	if (apiEndpoint.startsWith("http")) {
		finalUrl = new URL(apiEndpoint);
	} else {
		// Complete the relative URL
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
		if (!baseUrl || !baseUrl.startsWith("http")) {
			throw new ApiError(
				500,
				`ApiClient call failed : the environment variable NEXT_PUBLIC_SITE_URL is ${baseUrl}`
			);
		}
		finalUrl = new URL(apiEndpoint, baseUrl.replace("6006", "3000")); // Replace Storybook port number by dev port number to allow testing from Storybook
	}
	// Append the query parameters
	if (typeof params === "object") {
		Object.keys(params).forEach((paramName) =>
			finalUrl.searchParams.append(paramName, params[paramName])
		);
	}
	console.log(`buildUrl() : ${finalUrl.toString()}`);
	return finalUrl;
};

/**
 *
 * @param {ReadableStream} stream
 * @return {Promise<String>}
 */
const readStreamAsText = async (stream) => {
	const chunks = [];
	return new Promise((resolve, reject) => {
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("error", reject);
		stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
	});
};

/**
 * We expect the response to be in JSON format, but sometimes.. shit happens..
 * @see https://stackoverflow.com/questions/40497859/reread-a-response-body-from-javascripts-fetch
 * For an explanation of the strategy of cloning the response before trying to parse it to JSON
 * @param {HttpResponse} resp
 * @return {Object}
 */
const readResponseBody = async (resp) => {
	let retry;
	try {
		// retry = resp.clone(); // Don't bother
		return await resp.json();
	} catch (err) {
		// Error parsing JSON format
		// The stream is locked and will return a TypeError "Response.arrayBuffer: Body has already been consumed"
		// if we re-try to read it
		// We must read the cloned response instead
		// const respText = await retry.text();
		return {
			code: resp.status,
			success: false,
			error: resp.statusText // statusText is usually enough to understand what's going on (404)
		};
	}
};

/**
 * HTTP GET on our Next.js local API
 * @param {String} apiEntryPoint
 * @param {Object} [apiParams] Optional parameters (as key-value pairs)
 * @return {Object} the parsed JSON response if no error was thrown
 * @throws {ApiError}
 */
export const get = (APIClient.get = async (apiEntryPoint, apiParams) => {
	let resp;
	try {
		console.log(`API CALL : GET ${apiEntryPoint}`);

		resp = await fetch(buildURL(apiEntryPoint, apiParams), {
			method: "GET",
			headers: _DEFAULT_REQUEST_HEADERS
		});
		const respBody = await readResponseBody(resp);

		if (respBody.error) {
			throw new ApiError(respBody.code, respBody.error);
		}

		return respBody;
	} catch (err) {
		console.error(
			`GET to ${apiEntryPoint} raised an API error response`,
			err.message
		);
		const errorCode = err.code || resp?.status || 500;
		throw new ApiError(
			errorCode,
			`Call to ${apiEntryPoint} failed : ${err.message} (${errorCode})`
		);
	}
});

/**
 * POST to Next.js API
 * @param {String} postUrl
 * @param {Object} postBody Body data
 * @return {Promise<Object>} return the parsed API response
 */
export const post = (APIClient.post = async (apiEntryPoint, postBody = {}) => {
	try {
		console.log(`API CALL : POST ${apiEntryPoint}`);

		const resp = await fetch(buildURL(apiEntryPoint), {
			method: "POST",
			headers: _DEFAULT_REQUEST_HEADERS,
			body: JSON.stringify(postBody)
		});

		const respBody = await readResponseBody(resp);

		if (respBody.error) {
			throw new ApiError(respBody.code, respBody.error);
		}

		return respBody;
	} catch (err) {
		console.error(`POST to ${apiEntryPoint} raised an API error response`, err);
		throw new ApiError(
			err.code || 500,
			`Call to ${apiEntryPoint} failed : ${err.message}`
		);
	}
});

export default APIClient;
