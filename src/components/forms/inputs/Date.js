import Formatted from "./Formatted";
import { isDate, applyDateMask, serializeDate, formatISODate } from "../validation/utils";

/**
 * @typedef DateInputProps
 * @field {String} format The date format. Use `d` for days, `m` for months, `y` for years
 * @field {Number} [defaultValue]
 * @field {Boolean|String} [required=false]
 * @field {Object} validation Additional custom validation rules
 * @field {String} [errorMessage] A custom error message when the validation fails
 */
/**
 * Display a text input uniquely dedicated to dates
 * The date serialization is made in ISO format
 * Note : the defaultValue must be given in ISO format
 * @example
 *   <Date format="dd/mm/yyyy" />
 * @param {DateInputProps} props
 */
const Date = ({
	format = "dd/mm/yyyy",
	defaultValue = null,
	required = false,
	errorMessage,
	validation = {},
	...props
}) => {
	validation.isDate = isDate(errorMessage);

	return (
		<Formatted
			required={required}
			format={applyDateMask(format)}
			serialize={serializeDate(format)}
			load={formatISODate(format)}
			defaultValue={defaultValue}
			validation={validation}
			inputType="tel"
			inputProps={{ style: { textAlign: "right" } }}
			{...props}
		/>
	);
};

export default Date;
