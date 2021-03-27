/**
 * Two different formats for options are accepted in the Select, CheckBoxes as well as Radio input
 * Takes a key:value map and return an array with {code, label} entries
 * @param {Object} map
 */
export const convertOptions = (map) =>
	Object.keys(map).reduce((options, key) => {
		options.push({ code: key, label: map[key] });
		return options;
	}, []);

/**
 * Display the label associated with the code of a Select list of options
 * @param {String} value
 * @param {Array|Object} options
 * @returns {String}
 */
export const displaySelectedOption = (value, options) => {
	if (Array.isArray(options)) {
		const selected = options.find((opt) => opt.code === value);
		return selected ? selected.label : "";
	} else {
		// It is the hashmap format
		return options[value] || "";
	}
};
