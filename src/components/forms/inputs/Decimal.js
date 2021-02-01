import Formatted from "./Formatted";
import {
	getDigitsOnly,
	formatDecimalWithUnit,
	isDecimal,
	isBetween
} from "../validation/utils";

export const serializeDecimal = (decimalsSeparator) => (str = "") => {
	const decimalParts = str
		.split(decimalsSeparator)
		.map(getDigitsOnly)
		.map((val) => val || "0");

	return Number.parseFloat(decimalParts.join("."));
};

/**
 * @typedef DecimalInputProps
 * @field {Number} [defaultValue]
 * @field {Boolean|String} [required=false]
 * @field {Object} validation Custom  validation rules
 * @field {String} [thousandsSeparator=" "] How to separate thousands groups of digits
 * @field {String} [decimalsSeparator=","] Decimal point symbol
 * @field {String} [unit] Optional unit (sufix)
 * @field {Array<Decimal,Decimal>} [plage] Optional plage of values to restrict the input
 * @fiels {String} [errorMessage] A custom error message when teh validation fails
 */
/**
 * Display a text input uniquely dedicated to integer numbers
 * With an optional unit
 * @param {DecimalInputProps} props
 */
const Decimal = ({
	thousandsSeparator = " ",
	decimalsSeparator = ",",
	defaultValue = null,
	required = false,
	errorMessage,
	maxDecimals,
	prefix = "",
	suffix = "",
	plage,
	...props
}) => {
	if (required) {
		defaultValue = 0;
	}
	const validation = {};
	if (Array.isArray(plage)) {
		validation.isBetween = isBetween(plage[0], plage[1], errorMessage);
	}

	return (
		<Formatted
			required={required}
			format={formatDecimalWithUnit(
				thousandsSeparator,
				decimalsSeparator,
				maxDecimals,
				prefix,
				suffix
			)}
			serialize={serializeDecimal(decimalsSeparator)}
			defaultValue={defaultValue}
			validation={validation}
			inputType="tel"
			inputProps={{ style: { textAlign: "right" } }}
			{...props}
		/>
	);
};

export default Decimal;
