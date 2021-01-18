/**
 * Extract the property value at the designed path
 * @example getProperty({ person: { firstName: "John" }}, "person.firstName", "")
 * @param {Object} source Object to extract the property from
 * @param {String} path Usings dots and [] to access sub properties
 * @param {Object} [defaultValue] what to return if the property is not found (undefined)
 * @return {Any}
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

	return result === undefined || result === null || result === source
		? defaultValue
		: result;
};
