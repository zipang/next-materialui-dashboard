import { StringProducerTransformer } from "quicktype/dist/quicktype-core/Transformers";

/**
 * Split a path to a property into its keys
 * (property names or array indexes)
 * @example
 *   splitPath("persons[0].address.street") => ["persons", "0", "address", "street"]
 * @param {StringProducerTransformer} path
 * @return {Array}
 */
export const splitPath = (path = "") => path.split(/[,[\].]+?/).filter(Boolean);

/**
 * Extract the property value at the designed path
 * @example getProperty({ person: { firstName: "John" }}, "person.firstName", "")
 * @param {Object} source Object to extract the property from
 * @param {String} path Usings dots and [] to access sub properties
 * @param {Object} [defaultValue] what to return if the property is not found (undefined)
 * @return {Any}
 */
export const getProperty = (source = {}, path = "", defaultValue) => {
	const result = splitPath(path).reduce(
		(result, key) => (result !== null && result !== undefined ? result[key] : result),
		source
	);

	return result === undefined || result === null || result === source
		? defaultValue
		: result;
};

export const setProperty = (source = {}, path = "", newValue) => {
	let property = source;
	const keys = splitPath(path);
	keys.forEach((key, i) => {
		if (property[key] === undefined) {
			// Look ahead to see if we need to create an array or an object
			if (keys[i + 1] !== undefined) {
				if (parseInt(keys[i + 1]) !== NaN) {
					// It's an array index
					property[key] = Array(parseInt(keys[i + 1]) + 1).fill(undefined);
				} else {
					property[key] = {};
				}
				property = property[key];
			}
		}
	});
	property = newValue;
};
