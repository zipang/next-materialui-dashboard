import React, { useState, createRef, useLayoutEffect } from "react";
import {
	TextField,
	Input as MaterialInput,
	InputLabel,
	Select,
	Button,
	MenuItem,
	FormControl,
	FormHelperText,
	Checkbox as MaterialCheckbox,
	FormControlLabel,
	Grid
} from "@material-ui/core";
import { useRifm } from "rifm";
import { useFormContext } from "react-hook-form";
import { getProperty } from "@lib/utils/NestedObjects";
import { StringExtensions } from "@lib/utils/Strings";
import GroupLabel from "./GroupLabel";

const _BASE_INPUT_STYLES = {
	variant: "outlined",
	fontSize: "large",
	margin: "dense"
};

const noop = (val) => val;

/**
 * @typedef InputProps
 * @field {String} name The name of the field (can use dots to describe a deeply nested property)
 * @field {String} label The field label
 * @field {Boolean} [required=false] Value required
 * @field {String}  [placeHolder] Text shown before any input
 * @field {Boolean} [autoFocus=false] Get focus on this field on page load ?
 * @field {Boolean} [readOnly=false] Can or cannot edit
 * @field {Object} [validation={}] Validation object
 */

/**
 * Basically same features as Text input
 * but with full control
 * @param {InputProps} props -
 */
const Text = ({
	name = "text",
	label = "Text",
	required = false,
	autoComplete = false,
	autoFocus = false,
	validation = {},
	...moreProps
}) => {
	// Find the parent form to register our input
	const inputRef = createRef();
	const {
		register,
		registerField,
		errors,
		watch,
		setValue,
		validate,
		trigger
	} = useFormContext();
	const errorMessage = getProperty(errors, `${name}.message`, "");
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Pass the required attribute to the validation object
	if (required === true) validation.required = `Saisissez un ${label}`;
	if (validation.required) label += "*";

	const onChange = (evt) => {
		setValue(name, (value = evt.target.value));
		if (errorMessage) {
			trigger(); // Show when the input become valid again
		}
		//  else if (evt.key === "Enter" && !evt.shiftKey) {
		// 	validate();
		// }
	};
	let value = watch(name) || "";
	if (registerField) {
		registerField({ name, ref: inputRef, validation });
	} else {
		register(name, validation);
	}

	useLayoutEffect(() => {
		// value = watch(name) || "";
		if (autoFocus || errorMessage) {
			console.log(`Focus on ${name} (${errorMessage})`);
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<TextField
			id={name}
			// {...inputProps}
			inputRef={inputRef}
			name={name}
			value={value}
			label={label}
			onChange={onChange}
			error={Boolean(errorMessage)}
			autoComplete={autoComplete ? "" : "off"}
			autoFocus={autoFocus}
			helperText={errorMessage}
			fullWidth={true}
			{...mergedProps}
		/>
	);
};

/**
 * Text input with special format
 * @param {FormattedInputProps} props -
 */
export const Formatted = ({
	name = "formatted-input",
	label = "Use a label",
	helperText = "",
	inputType = "text",
	mask = false,
	format = noop,
	load = noop,
	serialize = noop,
	append,
	required = false,
	autoFocus = false,
	validation = {},
	size = 20,
	placeHolder = "",
	...moreProps
}) => {
	// Find the parent form to register our input
	const inputRef = createRef();
	const {
		register,
		registerField,
		errors,
		watch,
		setValue,
		trigger,
		validate
	} = useFormContext();
	const errorMessage = getProperty(errors, `${name}.message`, "");
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Pass the required attribute to the validation object
	if (required === true) validation.required = `Saisissez un ${label}`;
	if (validation.required) label += "*";

	if (registerField) {
		registerField({ name, ref: inputRef, validation });
	} else {
		register(name, validation);
	}

	let value = watch(name) || "";

	// We store 2 distinct values : the real one
	// and the displayed (formatted) value for the visible TextField
	const [displayedValue, setDisplayedValues] = useState(load(value));
	const onChange = (userInput) => {
		setValue(name, (value = serialize(userInput)));
		setDisplayedValues(format(userInput));
		if (errorMessage) {
			trigger(); // Show when the input become valid again
		} // we don't have the original event here
	};
	const rifmParams = {
		value: displayedValue,
		mask: { mask },
		onChange,
		format
	};
	if (typeof append === "function") {
		rifmParams.append = append;
	}
	const rifm = useRifm(rifmParams);

	useLayoutEffect(() => {
		value = watch(name) || "";
		if (autoFocus || errorMessage) {
			console.log(`Focus on ${name} (${errorMessage})`);
			inputRef.current.focus();
		}
	}, [name]);

	// We create 2 synchronized input fields :
	// one for the displayed and formatted value that is not tied to form data because it has no name
	// and a hidden one that stores the real unformatted value tied to the control name
	return (
		<TextField
			id={`formatted-${name}`}
			inputRef={inputRef}
			placeholder={placeHolder}
			label={label}
			value={rifm.value}
			onChange={rifm.onChange}
			autoFocus={autoFocus}
			error={Boolean(errorMessage)}
			helperText={helperText || errorMessage}
			inputProps={{
				size
			}}
			{...mergedProps}
		/>
	);
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
 * @return {Function} the real formatter fonction to use inside <Input.Formatted />
 * @example
 *   formatInteger(" ")(12345678) => "12 345 678"
 */
const formatInteger = (sep = " ") => (str = "") => {
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
		<Formatted
			format={typeof format === "function" ? format : formatInteger(separator)}
			serialize={serializeInteger}
			validation={validation}
			inputType="number"
			size="8"
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

export const formatISODate = (dateFormat = "dd/mm/yyyy") => (str = "") => {
	if (!str) return "";

	const [year, month, day] = str.split("-");
	const formatted = dateFormat
		.replace("dd", day)
		.replace("mm", month)
		.replace("yyyy", year);
	console.log(`Formatting ${str} to ${formatted}`);
	return formatted;
};

/**
 * Generate an input date formatter from a dateFormat
 * @example
 *   const frenchDateFormatter = dateFormatter("dd/mm/yyyy")
 *   const usDateFormatter = dateFormatter("mm-dd-yyyy")
 * @param {String} dateFormat Uses d, m or y to indicate the relative position of day month or year digit
 * @return {Function} Usable inside Input.Date as the input formatter
 */
export const dateFormatter = (dateFormat = "dd/mm/yyyy") => (str = "") => {
	const digits = getDigitsOnly(str).substr(0, 8);
	const inputLength = digits.length;
	if (!inputLength) return "";
	let decalage = 1;
	return digits
		.split("")
		.reduce(
			(prev, cur, i) =>
				`${prev}${cur}` +
				(i !== inputLength - 1 && isDateSeparator(dateFormat[i + decalage])
					? dateFormat[i + decalage++]
					: ""),
			""
		);
};
export const dateSeparatorAppender = (dateFormat = "dd/mm/yyyy") => (str = "") => {
	if (str.length === dateFormat.length) return str;
	const nextCharInFormat = dateFormat[str.length];
	if (isDateSeparator(nextCharInFormat)) {
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
export const Date = ({ dateFormat = "dd/mm/yyyy", size = 10, ...props }) => {
	const validation = {
		isDate: (ISODate) =>
			typeof Date.parse(ISODate) === "number" ? true : "Date invalide"
	};
	return (
		<Formatted
			format={dateFormatter(dateFormat)}
			load={formatISODate(dateFormat)}
			// append={dateSeparatorAppender(dateFormat)}
			serialize={serializeDate(dateFormat)}
			validation={validation}
			size={size}
			placeHolder={dateFormat}
			{...props}
		/>
	);
};

/**
 * Generate an input formatter of digits only from a mask
 * @example
 *   const frenchTelMask = applyNumericMask("+(99) 9 99 99 99 99")
 *   const frenchDateMask = applyNumericMask("99/99/9999")
 * @param {String} mask Uses '9' to indicate the position of a digit ([0-9])
 * @return {Function} Usable inside Input.Formatter, Input.Date, Input.Tel..
 */
export const applyNumericMask = (mask = "99 99 99 99") => (str = "") => {
	const howManyDigits = mask.count("9");
	const validInput = getDigitsOnly(str).substr(0, howManyDigits);
	const digits = validInput.split("");
	const formatted = mask
		.split("")
		.map((maskLetter, i) => {
			return maskLetter === "9" ? digits.shift() || "_" : maskLetter;
		})
		.join("");
	return formatted;
};

/**
 * Formatted Input for telephone numbers
 * @param {InputProps} props
 */
export const Tel = ({
	format = "99 99 99 99 99",
	placeHolder = "01 23 45 67 89",
	...props
}) => {
	const validation = {
		validate: {
			isComplete: (formatted) =>
				formatted.count("9") === mask.count("9") ? true : "No incomplet",
			invalid: (formatted) =>
				!["01", "06", "07"].includes(formatted.substr(0, 2))
					? true
					: "No invalide (ne commence pas par 01, 06, 07)"
		}
	};
	return (
		<Formatted
			format={applyNumericMask(format)}
			mask={true}
			validation={validation}
			size={14}
			placeHolder={placeHolder}
			inputType="tel"
			{...props}
		/>
	);
};

/**
 * Input only integer values between [0-100] and format them as `99%`
 * @param {InputProps} props
 */
export const Percent = ({ ...props }) => (
	<Integer format={formatPercent} plage={[0, 100]} size={3} {...props} />
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
 * Text Input with specific url validation
 * @param {InputProps} props
 */
export const Url = ({ validation = {}, ...props }) => {
	const urlValidation = {
		...validation,
		validate: {
			invalid: (val) => {
				try {
					new URL(val);
					return true;
				} catch (err) {
					return "URL invalide";
				}
			}
		}
	};
	return <Text validation={urlValidation} {...props} />;
};

/**
 * Take everything from Input.Text but change type to password
 * @param {JSX.} props
 */
export const Password = ({ ...props }) => <Text type="password" {...props} />;

/**
 * This checkbox
 * @param {*} param0
 */
export const CheckBox = ({
	name = "checkbox",
	label = "Y/N",
	valueIfChecked = "Y",
	autoFocus = false,
	...moreProps
}) => {
	// Find the parent form to register our input
	const inputRef = createRef();
	const {
		register,
		registerField,
		watch,
		setValue,
		validate,
		trigger
	} = useFormContext();
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	const onChange = (evt) => {
		setValue(name, (value = evt.target.checked ? valueIfChecked : undefined));
		// if (evt.key === "Enter" && !evt.shiftKey) {
		// 	validate();
		// }
	};
	let value = watch(name) || "";
	if (registerField) {
		registerField({ name, ref: inputRef, validation: {} });
	} else {
		register(name, {});
	}

	useLayoutEffect(() => {
		if (autoFocus) {
			console.log(`Focus on ${name}`);
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<FormControlLabel
			control={
				<MaterialCheckbox
					name={name}
					ref={inputRef}
					value={valueIfChecked}
					checked={value === valueIfChecked}
					onChange={onChange}
				/>
			}
			label={label}
		/>
	);
};

const convertOptions = (map) =>
	Object.keys(map).reduce((options, key) => {
		options.push({ code: key, label: map[key] });
		return options;
	}, []);

/**
 * This checkbox
 * @param {*} param0
 */
export const CheckBoxes = ({
	name = "checkbox",
	label = "",
	options = [],
	autoFocus = false,
	validation = {},
	width = 1 / 3, // 3 columns
	...moreProps
}) => {
	// Find the parent form to register our input
	const {
		register,
		registerField,
		watch,
		setValue,
		validate,
		trigger
	} = useFormContext();

	const inputRef = createRef(); // This ref will reference the first checkbox in the serie
	if (registerField) {
		// StepForm context
		registerField({ name, ref: inputRef, validation });
	} else {
		// Ordinary react-hook-form context
		register(name, validation);
	}

	// This field value is in fact an array of values corresponding to checked elements
	let values = watch(name, []);
	console.log(`Loaded value of ${name}`, values);
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Accept a hashmap (key : value) as different format
	if (!Array.isArray(options)) options = convertOptions(options);

	/**
	 * When a single checkbox change
	 * @param {*} evt
	 */
	const onChange = (evt) => {
		if (evt.target.checked) {
			setValue(name, (values = [...values, evt.target.value]));
		} else {
			const valueToRemove = evt.target.name.split(":")[1];
			setValue(name, (values = values.filter((val) => val !== valueToRemove)));
		}
		// if (evt.key === "Enter" && !evt.shiftKey) {
		// 	validate();
		// }
	};

	useLayoutEffect(() => {
		if (autoFocus) {
			console.log(`Focus on ${name}`);
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<GroupLabel label={label}>
			<Grid id={name} container>
				{options.map(({ code, label }, i) => {
					if (i === 0) {
						return (
							<Grid item sm={Number(width * 12)}>
								<FormControlLabel
									control={
										<MaterialCheckbox
											name={`${name}:${code}`}
											key={`${name}:${code}`}
											inputRef={inputRef} // the ref for focus is on the first element
											value={code}
											checked={values.includes(code)}
											onChange={onChange}
										/>
									}
									key={`${name}:${code}-label`}
									label={label}
								/>
							</Grid>
						);
					} else {
						return (
							<Grid item sm={Number(width * 12)}>
								<FormControlLabel
									control={
										<MaterialCheckbox
											name={`${name}:${code}`}
											key={`${name}:${code}`}
											value={code}
											checked={values.includes(code)}
											onChange={onChange}
										/>
									}
									label={label}
								/>
							</Grid>
						);
					}
				})}
			</Grid>
		</GroupLabel>
	);
};

/**
 * Select a value amonst dome predefined options
 * @param {*} param0
 */
export const SelectBox = ({
	name = "select-box",
	label = "Select",
	required = false,
	autoFocus = false,
	validation = {},
	options = [],
	...moreProps
}) => {
	// Find the parent form to register our input
	const { registerField, watch, errors, setValue, validate } = useFormContext();
	const errorMessage = getProperty(errors, `${name}.message`, "");
	const inputRef = createRef();
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Pass the required attribute to the validation object
	if (required === true) validation.required = `Saisissez un ${label}`;
	if (validation.required) label += "*";

	if (registerField) registerField({ name, ref: inputRef, validation });

	// Accept a hashmap (key : value) as different format
	if (!Array.isArray(options)) options = convertOptions(options);

	const onChange = (evt) => {
		setValue(name, (value = evt.target.value));
		if (errorMessage) {
			trigger(); // Show when the input become valid again
		} else if (evt.key === "Enter" && !evt.shiftKey) {
			validate();
		}
	};
	let value = watch(name) || "";

	return (
		<FormControl error={Boolean(errorMessage)}>
			<InputLabel id={`${name}-label`}>{label}</InputLabel>
			<Select
				id={name}
				labelId={`${name}-label`}
				inputRef={inputRef}
				inputProps={{
					name
				}}
				fullWidth={true}
				value={value}
				autoFocus={autoFocus}
				onChange={onChange}
				// renderValue={(value) => `⚠️  - ${value}`}
				{...mergedProps}
			>
				{!required && (
					<MenuItem key={`${name}-empty-option`} value={null}>
						&nbsp;
					</MenuItem>
				)}
				{options.map((option) => (
					<MenuItem key={option.code} value={option.code}>
						{option.label}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>{errorMessage}</FormHelperText>
		</FormControl>
	);
};

export const Submit = ({ label = "OK", ...moreProps }) => (
	<Button
		type="submit"
		fullWidth
		variant="contained"
		color="primary"
		className="submit"
		{...moreProps}
	>
		{label}
	</Button>
);
/**
 * This hidden submit button is able to intercept the ENTER key event
 * to automatically submit the form
 * @see https://stackoverflow.com/questions/11525726/hiding-an-html-forms-submit-button/11526065
 */
export const HiddenSubmit = () => (
	<input type="submit" className="hidden" aria-hidden="true" />
);

const customInputs = {};

/**
 * Register custom input to render them using
 * <Input type="custom" {...props} />
 * @param {String} name The custom type to register
 * @param {Function} render
 */
export const registerInput = (name, render) => {
	customInputs[name] = render;
};

const Input = ({ type, ...fieldProps }) => {
	console.log(`Generating input ${type}`, fieldProps);
	switch (type) {
		case "text":
			return <Text {...fieldProps} />;
		case "checkbox":
			return <CheckBox {...fieldProps} />;
		case "checkboxes":
			return <CheckBoxes {...fieldProps} />;
		case "select":
			return <SelectBox {...fieldProps} />;
		case "date":
			return <Date {...fieldProps} />;
		case "integer":
			return <Integer {...fieldProps} />;
		case "percent":
			return <Percent {...fieldProps} />;
		case "email":
			return <Email {...fieldProps} />;
		case "tel":
			return <Tel {...fieldProps} />;
		case "url":
			return <Url {...fieldProps} />;
		case "formatted":
			return <Formatted {...fieldProps} />;

		default:
			if (customInputs[type]) {
				return customInputs[type]({ ...fieldProps });
			} else {
				return <Text {...fieldProps} />;
			}
	}
};

// Allow to use <Input.Text ...> as well as <Input type="text" ...>
Object.assign(Input, {
	Text,
	CheckBox,
	CheckBoxes,
	Email,
	Tel,
	Url,
	Date,
	Password,
	Formatted,
	Integer,
	Percent,
	SelectBox,
	Submit,
	HiddenSubmit
});

export default Input;
