import React, { useState } from "react";
import {
	TextField,
	Input as MaterialInput,
	Button,
	MenuItem,
	Box
} from "@material-ui/core";
import { useRifm } from "rifm";
import { useFormContext } from "react-hook-form";

const _BASE_INPUT_STYLES = {
	variant: "outlined",
	fontSize: "large",
	margin: "dense"
};

/**
 * @typedef InputProps
 * @field {String} name The name of the field (can use dots to describe a deeply nested property)
 * @field {String} label The field label
 * @field {Boolean} [required=false] Value required
 * @field {Boolean} [autoComplete=false] Allow auto-completion
 * @field {Boolean} [autoFocus=false] Get focus on this field on page load ?
 * @field {Object} [validation={}] Validation object
 */

/**
 * Text input that will automaticaly register itself to the nearest FormContext
 * @param {InputProps} props -
 */
const Text = ({
	name = "text",
	label = "Text",
	value = "",
	required = false,
	autoComplete = false,
	autoFocus = false,
	validation = {},
	...moreProps
}) => {
	// Find the parent form to register our input
	const { register, errors } = useFormContext();
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Pass the required attribute to the validation object
	if (required === true) validation.required = `Saisissez un ${label}`;
	if (validation.required) label += "*";

	return (
		<TextField
			name={name}
			id={name}
			label={label}
			defaultValue={value}
			error={Boolean(errors[name])}
			inputRef={register(validation)}
			autoComplete={autoComplete ? "" : "off"}
			autoFocus={autoFocus}
			helperText={errors[name] ? errors[name].message : " "}
			{...mergedProps}
		/>
	);
};

const HiddenText = ({ name, value = "", inputType = "text", inputRef, ...moreProps }) => {
	// // Find the parent form to register our input
	// const { register, errors } = useFormContext();

	// // Pass the required attribute to the validation object
	// if (required === true) validation.required = true;

	return (
		<input
			hidden
			name={name}
			id={name}
			type={inputType}
			ref={inputRef}
			value={value}
			{...moreProps}
		/>
	);
};

/**
 * Text input with special format
 * @param {FormattedInputProps} props -
 */
export const Format = ({
	name = "formatted-input",
	label = "Use a label",
	inputType = "text",
	format = (val) => val,
	load = (val) => val,
	append,
	serialize,
	value = "",
	required = false,
	validation = {},
	...moreProps
}) => {
	// Find the parent form to register our input
	const { register, errors, handleSubmit } = useFormContext();

	// As this input format the value for display, we use a distinct displayedValue state for the visible TextField
	const [displayedValue, setDisplayedValue] = useState(format(load(value)));
	const [hiddenValue, setHiddenValue] = useState(value);

	// Depending on if we have a serializer function
	// we store the real unformatted value in a hidden field
	const onChange =
		typeof serialize === "function"
			? (userInput) => {
					setHiddenValue(serialize(userInput));
					setDisplayedValue(userInput);
					// if (errors[name]) handleSubmit();
			  }
			: setDisplayedValue;

	const rifmParams = {
		value: displayedValue,
		onChange,
		format
	};
	if (typeof append === "function") {
		rifmParams.append = append;
	}

	const rifm = useRifm(rifmParams);

	// Pass the required attribute to the validation object
	if (required === true) validation.required = `Saisissez un ${label}`;
	if (validation.required) label += "*";

	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	if (typeof serialize === "function") {
		// We create 2 synchronized input fields : one for the displayed and formatted value
		// and a hidden one that stores the real unformatted value
		return (
			<>
				<TextField
					label={label}
					value={rifm.value}
					onChange={rifm.onChange}
					error={Boolean(errors[name])}
					helperText={errors[name] ? errors[name].message : " "}
					{...mergedProps}
				/>
				<HiddenText
					id={`hidden-${name}`}
					name={name}
					inputType={inputType}
					inputRef={register(validation)}
					value={hiddenValue}
					readOnly
				/>
			</>
		);
	} else {
		// The formatted value is the value that we really use and store
		return (
			<Text
				name={name}
				label={label}
				validation={validation}
				value={rifm.value}
				onChange={rifm.onChange}
				{...mergedProps}
			/>
		);
	}
};

/**
 * Takes only the digits ([0-9]) from an input string
 * @param {String} str Input string
 * @return {String}
 */
const getDigitsOnly = (str = "") => str.replace(/[^\d]+/gi, "");

/**
 *
 * @param {String} sep the character that will separate the blocks of 3 digits
 * @return {Function} the real formatter fonction to use inside <Input.Format />
 * @example
 *   formatInteger(" ")(12345678) => "12 345 678"
 */
const formatInteger = (sep = " ") => (str = "") => {
	const number = getDigitsOnly(str + "");
	if (number === "" || sep === "") return number;
	const len = number.length;
	const formatted = number.split("").reduce(
		(prev, cur, i) =>
			i > 0 && (len - i) % 3 === 0
				? `${prev}${sep}${cur}` // add the separator between every 3 digits blocks
				: `${prev}${cur}`,
		""
	);
	console.log(`Formatting "${number}" to "${formatted}"`);
	return formatted;
};

const serializeInteger = (str = "") =>
	str.length ? Number.parseInt(getDigitsOnly(str)) : "";

/**
 * Display a number with thousands separator like `1 000 000 000`
 * or with a custom formatter
 * Optionally provide a plage for min and max values
 */
export const Integer = ({ separator = " ", format, plage = [], ...props }) => {
	const validation = {
		valueAsNumber: true
	};
	const [min, max] = plage;
	if (typeof min === "number") {
		validation.min = (str) =>
			Number.parseInt(str) >= min || `Ce nombre doit être plus grand que ${min}`;
	}
	if (typeof max === "number") {
		validation.max = (str) =>
			Number.parseInt(str) <= max || `Ce nombre doit être plus petit que ${max}`;
	}
	return (
		<Format
			format={typeof format === "function" ? format : formatInteger(separator)}
			serialize={serializeInteger}
			validation={validation}
			inputType="number"
			width="10ch"
			{...props}
		/>
	);
};

export const formatPercent = (str = "") => {
	const number = getDigitsOnly(str + "").substr(0, 3);
	return number.length ? `${number}%` : "";
};

/**
 * Everything that is not a letter indicating the day, month or year digit
 * is considered as a separator in the date format
 * @param {String} char a single letter part of the date format
 */
const isDateSeparator = (char) => !/[dmy]/i.test(char);

/**
 * Generate an input date formatter from a dateFormat
 * @example
 *   const frenchDateFormatter = dateFormatter("dd/mm/yyyy")
 *   const usDateFormatter = dateFormatter("mm-dd-yyyy")
 * @param {String} dateFormat Uses d, m or y to indicate the relative position of day month or year digit
 * @return {Function} Usable inside Input.Date as the input formatter
 */
export const dateFormatter = (dateFormat = "dd/mm/yyyy") => (str = "") => {
	// const formatLength = dateFormat.length;
	// let formatted = str
	// 	.substr(0, formatLength)
	// 	.split("")
	// 	.reduce((formatted, letter, i) => {
	// 		const formatPart = dateFormat[i];
	// 		if (
	// 			(/[dmy]/.test(formatPart) && /\d/.test(letter)) ||
	// 			formatPart === letter
	// 		) {
	// 			formatted += letter;
	// 		}
	// 		return formatted;
	// 	}, "");

	// if (
	// 	formatted.length < formatLength &&
	// 	isDateSeparator(dateFormat[formatted.length])
	// ) {
	// 	formatted += dateFormat[formatted.length];
	// }
	// console.log(`Formatting date input '${str}' to '${formatted}'`);
	// return formatted;

	const dateFormatParts = dateFormat.split("");
	const digits = getDigitsOnly(str).substr(0, 8);
	const inputLength = digits.length;
	if (!inputLength) return "";
	let decalage = 1;
	return dateSeparatorAppender(dateFormat)(
		digits
			.split("")
			.reduce(
				(prev, cur, i) =>
					`${prev}${cur}` +
					(i !== inputLength - 1 &&
					isDateSeparator(dateFormatParts[i + decalage])
						? dateFormatParts[i + decalage++]
						: ""),
				""
			)
	);
};
export const dateSeparatorAppender = (dateFormat = "dd/mm/yyyy") => (str = "") => {
	if (str.length === dateFormat.length) return str;
	const nextCharInFormat = dateFormat[str.length];
	if (isDateSeparator(nextCharInFormat)) {
		console.log(`Appending ${nextCharInFormat} to ${str}`);
		return str + nextCharInFormat;
	} else {
		return str;
	}
};

/**
 * Given a specific date display format
 * (using d for day positions, m for month position and y for year position)
 * Buuild the serializer function that will serialize the date representation back to ISO
 * @param {String} format
 * @return {Function} ISO date serializer usable inside <Input.Date serialize />
 */
export const serializeDate = (format = "dd/mm/yyyy") => (formattedDate = "") => {
	if (formattedDate.length !== format.length) return ""; // uncomplete date input is not serializable
	const formatLetters = format.split("");
	const dateDigits = formattedDate.split("");
	const { year, month, day } = dateDigits.reduce(
		(prev, cur, i) => {
			if (formatLetters[i] === "d") {
				prev.day += cur;
			} else if (formatLetters[i] === "m") {
				prev.month += cur;
			} else if (formatLetters[i] === "y") {
				prev.year += cur;
			}
			return prev;
		},
		{
			year: "",
			month: "",
			day: ""
		}
	);
	return `${year}-${month}-${day}`;
};

/**
 * Text Input that specifically format dates on user input as they change
 * @param {InputProps} props
 */
export const Date = ({ dateFormat = "dd/mm/yyyy", ...props }) => {
	const validation = {
		isDate: (ISODate) => typeof Date.parse(ISODate) === "number"
	};
	return (
		<Format
			format={dateFormatter(dateFormat)}
			append={dateSeparatorAppender(dateFormat)}
			serialize={serializeDate(dateFormat)}
			validation={validation}
			width="10ch"
			{...props}
		/>
	);
};

/**
 * Input only integer values between [0-100] and format them as `99%`
 * @param {InputProps} props
 */
export const Percent = ({ ...props }) => (
	<Integer format={formatPercent} plage={[0, 100]} {...props} />
);

/**
 * Text Input with specific email validation
 * @param {InputProps} props
 */
export const Email = ({ validation = {}, ...props }) => {
	const emailValidation = {
		...validation,
		pattern: {
			value: /^.+@.+\..+$/,
			message: "Email invalide"
		}
	};
	return <Text validation={emailValidation} {...props} />;
};

/**
 * Take everything from Input.Text but change type to password
 * @param {JSX.} props
 */
export const Password = ({ ...props }) => <Text type="password" {...props} />;

/**
 * Select a value amonst dome predefined options
 * @param {*} param0
 */
export const SelectBox = ({ options = [], ...props }) => {
	return (
		<Text select={true} {...props}>
			{options.map((option) => (
				<MenuItem value={option.code}>{option.label}</MenuItem>
			))}
		</Text>
	);
};

export const Submit = ({ label = "OK" }) => (
	<Button
		type="submit"
		fullWidth
		variant="contained"
		color="primary"
		className="submit"
	>
		{label}
	</Button>
);

const Input = {
	Text,
	Password,
	Email,
	Format,
	Integer,
	Percent,
	Date,
	SelectBox,
	Submit
};

export default Input;
