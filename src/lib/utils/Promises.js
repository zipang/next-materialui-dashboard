/**
 * Build a promise that resolve in `ms` milliseconds with the response provided
 * NOTE: response may be a function, whose evaluation would be delayed by ms
 * @param {Number} ms The delay to wait before resolving the Promise
 * @param {Any} response The data to return after ms.
 * @return {Promise}
 */
export const delay = (ms, response) =>
	new Promise((resolve) =>
		setTimeout(
			() => resolve(typeof response === "function" ? response() : response),
			ms
		)
	);
