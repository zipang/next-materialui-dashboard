import "isomorphic-fetch";
import ApiError from "../ApiError.js";

const APIClient = {};

/**
 * We expect the response to be in JSON format, but sometimes.. shit happens..
 * @param {HttpResponse} resp
 * @return {Object}
 */
const readResponseBody = async (resp) => {
	try {
		return await resp.json();
	} catch (err) {
		// Error parsing JSON format
		const textBody = await resp.text();
		return {
			code: resp.status,
			success: false,
			error: textBody
		};
	}
};

export const get = (APIClient.get = async (...apiParams) => {});

/**
 * POST to Next.js API
 * @param {String} postUrl
 * @param {Object} postBody
 * @return {Promise<Object>} return the parsed API response
 */
export const post = (APIClient.post = async (postUrl, postBody = {}) => {
	// Complete the relative URL
	if (!postUrl.startsWith("http")) {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
		if (!baseUrl.startsWith("http")) {
			throw new ApiError(
				500,
				`ApiClient.post() failed : the environment variable NEXT_PUBLIC_SITE_URL is ${baseUrl}`
			);
		}
		postUrl = new URL(postUrl, baseUrl);
	}

	const resp = await fetch(postUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(postBody)
	});

	try {
		const respBody = await readResponseBody(resp);
		console.dir(`API POST to ${postUrl} returned`, respBody);

		if (respBody.error) {
			throw new ApiError(respBody.code, respBody.error);
		}

		return respBody;
	} catch (err) {
		console.error(`POST to ${postUrl} raised an API error response`, err);
		throw new ApiError(resp.status, `${err.message} (${resp.statusText})`);
	}
});

export default APIClient;
