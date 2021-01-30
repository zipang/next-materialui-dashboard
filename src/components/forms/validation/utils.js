export const _DEFAULT_MESSAGES = {
	isInteger: "This value must be an integer",
	isBetween: "This value must be between ${0} and ${1}"
};

/**
 * Extracts only the digits from a given input string
 * And truncate to `maxLength` digits
 * @param {Number} [maxLength=256]
 * @return {Function} Usable as the `format` property of a Formatted input
 */
export const getDigitsOnly = (maxLength = 256) => (str = "") => {
	return str.replace(/^\d/gi, "").substr(0, maxLength);
};

/**
 * Create a function that validates that a value is between the `min` and `max` range
 * @param {Number} min
 * @param {Number} max
 * @param {String} [msg] The error message to return if the validation fails
 * @return {true|String} If the return value is a string, that's an error message
 */
export const isBetween = (min, max, msg = _DEFAULT_MESSAGES.isBetween) => (value) => {
	return (
		(value >= min && value <= max) || msg.replace("${0}", min).replace("${1}", max)
	);
};

/**
 * Validate
 * @param {Any} value
 */
export const isInteger = (msg = _DEFAULT_MESSAGES.isInteger) => (value) =>
	Number.isInteger(value) || msg;

/**
 * Validate that an integer is between 0 and 100 (strict percentage)
 */
export const isPercentage = {
	validate: isBetween(0, 100),
	message: "This percentage must be between 0 and 100"
};
