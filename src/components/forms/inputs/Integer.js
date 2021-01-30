import Formatted from "./Formatted";
import { isInteger, isBetween } from "../validation";
import { formatIntegerWithUnit } from "../Input";

export const formatIntegerWithUnit = (
	decimalSeparator = ",",
	thousandsSeparator = " ",
	unit = ""
) => (str = "") => {
	const number = getDigitsOnly(str);
	return number.length
		? [formatDecimal(decimalSeparator, thousandsSeparator)(number), unit]
		: unit;
};

export const serializeInteger = (defaultValue = 0) => (str) =>
	typeof str === "string" ? Number.parseInt(getDigitsOnly(str)) : defaultValue;

const Integer = ({
	thousandsSeparator = " ",
	defaultValue = null,
	required = false,
	errorMessage,
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

	return <Formatted format={formatIntegerWithUnit} validatil={validation} {...props} />;
};
