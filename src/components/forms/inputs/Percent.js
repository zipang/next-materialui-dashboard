import Integer from "./Integer";
import { isInteger, isBetween } from "../validation/utils";

/**
 * @typedef PercentInputProps
 * @field {Number} [defaultValue]
 * @field {Boolean|String} [required=false]
 * @field {String} [thousandsSeparator=" "] How to separate thousands groups of digits
 * @field {String} [strict=false] Allow only values between 0 and 100
 * @fiels {String} [errorMessage] A custom error message when the validation fails
 */
/**
 * Display a text input uniquely dedicated to percentage
 * '%' suffix is automatically appended
 * @param {PercentInputProps} props
 */
const Percent = ({
	thousandsSeparator = " ",
	defaultValue = null,
	required = false,
	strict = false,
	errorMessage,
	...props
}) => {
	if (required) {
		defaultValue = 0;
	}
	const validation = {
		isInteger: isInteger(errorMessage)
	};
	if (strict) {
		validation.isBetween = isBetween(0, 100, errorMessage);
	}

	return (
		<Integer
			suffix="%"
			required={required}
			defaultValue={defaultValue}
			thousandsSeparator={thousandsSeparator}
			validation={validation}
			{...props}
		/>
	);
};

export default Percent;
