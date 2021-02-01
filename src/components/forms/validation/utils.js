export const _DEFAULT_MESSAGES = {
	isInteger: "This value must be an integer",
	isBetween: "This value must be between ${0} and ${1}"
};

/**
 * Extracts only the digits from a given input string
 * Usable as the `format` property of a Formatted input
 * @return {String}
 */
export const getDigitsOnly = (str = "") => {
	return str.replace(/[^\d]+/gi, "");
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
 * Build an integer validation function
 * @example
 *   <Formatted validation={{ isInteger }}
 * @param {String} errorMessage
 * @return {Function} the real `validation` fonction to use inside
 */
export const isInteger = (errorMessage = _DEFAULT_MESSAGES.isInteger) => (value) =>
	Number.isInteger(value) || errorMessage;

/**
 *
 * @param {String} sep the character that will separate the blocks of 3 digits
 * @return {Function} the real formatter fonction to use inside <Formatted />
 * @example
 *   formatInteger(" ")(12345678) => "12 345 678"
 */
export const formatInteger = (sep = " ") => (str = "") => {
	const number = getDigitsOnly(str + "");
	if (number === "" || sep === "") return number;
	const len = number.length;
	return number.split("").reduce(
		(prev, cur, i) =>
			i > 0 && (len - i) % 3 === 0
				? `${prev}${sep}${cur}` // add the separator between every 3 digits blocks
				: `${prev}${cur}`,
		""
	);
};

/**
 * Format an integer and then append a unit before (prefix) or after (suffix)
 * @param {String} thousandsSeparator Separate every 000 blocks of digits
 * @param {String} [prefix=""]
 * @param {String} [suffix=""]
 * @return {String|Array<String,String>}
 */
export const formatIntegerWithUnit = (
	thousandsSeparator = ".",
	prefix = "",
	suffix = ""
) => (str = "") => {
	const integerPart = formatInteger(thousandsSeparator)(str);
	if (suffix) {
		return [integerPart, suffix]; // This array splits at the cursor position for the next insertion
	} else {
		return prefix + integerPart;
	}
};

/**
 * Format a decimal number
 * @param {Char} thousandsSeparator
 * @param {Char} decimalSeparator
 * @return {String}
 */
export const formatDecimal = (thousandsSeparator = " ", decimalSeparator = ".") => (
	str = ""
) =>
	str
		.split(decimalSeparator)
		.map(formatInteger(thousandsSeparator))
		.join(decimalSeparator);

/**
 * Format an integer and then append a unit before (prefix) or after (suffix)
 * @param {String} thousandsSeparator Separate every 000 blocks of digits
 * @param {String} decimalsSeparator Decimal separator
 * @param {Numbre} [maxDecimals=2] Maximum number of decimals allowed
 * @param {String} [prefix=""]
 * @param {String} [suffix=""]
 * @return {String|Array<String,String>}
 */
export const formatDecimalWithUnit = (
	thousandsSeparator = ".",
	decimalsSeparator = ",",
	maxDecimals = 2,
	prefix = "",
	suffix = ""
) => (str = "") => {
	const decimalParts = (str + "")
		.split(decimalsSeparator)
		.map(formatInteger(thousandsSeparator))
		.map((val, i) => (i === 1 ? val.substr(0, maxDecimals) : val))
		.join(decimalsSeparator);

	if (suffix) {
		return [decimalParts, suffix]; // This array splits at the cursor position for the next insertion
	} else {
		return prefix + decimalParts;
	}
};

/**
 * Validate that an integer is between 0 and 100 (strict percentage)
 */
export const isPercentage = {
	validate: isBetween(0, 100),
	message: "This percentage must be between 0 and 100"
};
