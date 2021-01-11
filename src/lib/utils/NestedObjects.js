/**
 * Extract the property at the designed path
 * @param {Object} source
 * @param {String} path
 * @param {Object} defaultValue
 */
export const getProperty = (source = {}, path = "", defaultValue) => {
	const result = path
		.split(/[,[\].]+?/)
		.filter(Boolean)
		.reduce(
			(result, key) =>
				result !== null && result !== undefined ? result[key] : result,
			source
		);

	return result === undefined || result === source ? defaultValue : result;
};
