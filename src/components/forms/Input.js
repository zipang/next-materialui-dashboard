import { useState } from "react";
import { TextField, Input as MaterialInput, Button, MenuItem } from "@material-ui/core";
import { useRifm } from "rifm";
import { useFormContext } from "react-hook-form";

const MATERIAL_UI_STYLE = {
	variant: "outlined",
	fullWidth: true,
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
	const mergedProps = { ...MATERIAL_UI_STYLE, ...moreProps };

	// Pass the required attribute to the validation object
	if (required === true) validation.required = `Saisissez un ${label}`;
	if (validation.required) label += "*";

	return (
		<TextField
			name={name}
			id={name}
			label={label}
			// value={value}
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

/**
 * Text input with special format
 * @param {FormattedInputProps} props -
 */
export const Format = ({
	name = "formatted-input",
	label = "Use a label",
	format = (val) => val,
	load = (val) => val,
	serialize,
	value = "",
	required = false,
	validation = {},
	...moreProps
}) => {
	// Find the parent form to register our input
	const { register, errors } = useFormContext();

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
			  }
			: setDisplayedValue;

	const rifm = useRifm({
		value: displayedValue,
		onChange,
		format
	});

	// Pass the required attribute to the validation object
	if (required === true) validation.required = `Saisissez un ${label}`;
	if (validation.required) label += "*";

	const mergedProps = { ...MATERIAL_UI_STYLE, ...moreProps };

	if (typeof serialize === "function") {
		// We create 2 inouyt fields : one for the displayed and formatted value
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
				<MaterialInput
					type="hidden"
					id={`hidden-${name}`}
					name={name}
					inputRef={register(validation)}
					value={hiddenValue}
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
	str.length ? Number.parseInt(getDigitsOnly(str)) : undefined;

/**
 * Display a number with thousands separator like `1 000 000 000`
 * or with a custom formatter
 * Optionally provide a plage for min and max values
 */
export const Integer = ({ separator = " ", format, plage = [], ...props }) => {
	const validation = {};
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
			textAlign="right"
			{...props}
		/>
	);
};

const formatPercent = (str = "") => {
	const number = getDigitsOnly(str + "").substr(0, 3);
	return number.length ? `${number}%` : "";
};

/**
 * Input only integer values between [0-100] and format them as `99%`
 * @param {InputProps} props
 */
export const Percent = ({ ...props }) => (
	<Integer format={formatPercent} plage={[0, 100]} {...props} />
);

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
	SelectBox,
	Submit
};

export default Input;
