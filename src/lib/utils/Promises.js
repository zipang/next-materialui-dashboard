/**
 * Build a promise that resolve in `ms` milliseconds with the data provided
 * @param {Number} ms The delay to wait before resolving the Promise
 * @param {Any} data The data to return after ms
 * @return {Promise}
 */
export const delay = (ms, data) =>
	new Promise((resolve) => setTimeout(() => resolve(data), ms));
