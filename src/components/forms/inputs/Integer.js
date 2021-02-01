import Formatted from "./Formatted";
import {
	getDigitsOnly,
	formatIntegerWithUnit,
	isInteger,
	isBetween
} from "../validation/utils";

export const serializeInteger = (str) => {
	const digits = getDigitsOnly(str);
	return digits.length ? Number.parseInt(digits) : null;
};

/**
 * @typedef IntegerInputProps
 * @field {Number} [defaultValue]
 * @field {Boolean|String} [required=false]
 * @field {Object} validation Custom  validation rules
 * @field {String} [thousandsSeparator=" "] How to separate thousands groups of digits
 * @field {String} [unit] Optional unit (sufix)
 * @field {Array<Integer,Integer>} [plage] Optional plage of values to restrict the input
 * @fiels {String} [errorMessage] A custom error message when teh validation fails
 */
/**
 * Display a text input uniquely dedicated to integer numbers
 * With an optional unit
 * @param {IntegerInputProps} props
 */
const Integer = ({
	thousandsSeparator = " ",
	defaultValue = null,
	required = false,
	errorMessage,
	unit = "",
	plage,
	...props
}) => {
	if (required) {
		defaultValue = 0;
	}
	const validation = {
		isInteger: isInteger(errorMessage)
	};
	if (Array.isArray(plage)) {
		validation.isBetween = isBetween(plage[0], plage[1], errorMessage);
	}

	return (
		<Formatted
			required={required}
			format={formatIntegerWithUnit(thousandsSeparator, unit)}
			serialize={serializeInteger}
			defaultValue={defaultValue}
			validation={validation}
			inputType="tel"
			inputProps={{ style: { textAlign: "right" } }}
			{...props}
		/>
	);
};

export default Integer;
