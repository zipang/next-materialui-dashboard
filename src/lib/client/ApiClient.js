const APIClient = {};

export const get = (APIClient.get = async (...apiParams) => {});

/**
 * POST to Next.js API
 * @param {String} postUrl
 * @param {Object} postBody
 * @return {Promise<Object>} return the parsed API response
 */
export const post = (APIClient.post = async (postUrl, postBody = {}) => {
	if (typeof window === "undefined") {
		throw new Error("This method can only be called on the front-side !");
	}

	const resp = await fetch(postUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(postBody)
	});

	const respBody = await resp.json();
	console.dir(`API POST to ${postUrl} returned`, respBody);

	if (respBody.error) {
		throw new Error(respBody.error);
	}

	return respBody;
});

export default APIClient;
