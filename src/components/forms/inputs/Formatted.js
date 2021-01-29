import { createRef, useState, useEffect, useLayoutEffect } from "react";
import { TextField } from "@material-ui/core";
import { useFormValidationContext } from "../validation/FormValidationProvider";

const _BASE_INPUT_STYLES = {
	variant: "outlined",
	fontSize: "large",
	margin: "dense"
};

const noop = (val) => val;

/**
 * @typedef FormattedInputProps
 * @property {String} name The name of the field (can use dots to describe a deeply nested property)
 * @property {String} label The field label
 * @property {Function} format a function that takes the current input of the field and reformat it
 * @property {Function} serialize a function that takes formatted input of the field and serialize it to its actual storage format
 * @property {Boolean} [required=false] Value required
 * @property {String}  [placeHolder] Text shown before any input
 * @property {Boolean} [autoFocus=false] Get focus on this field on page load ?
 * @property {Boolean} [readOnly=false] Can or cannot edit
 * @property {Object} [validation={}] Validation object
 */

/**
 * Text input with special format
 * @param {FormattedInputProps} props -
 */
const Formatted = ({
	name = "formatted-input",
	label = "Use a label",
	helperText = "",
	inputType = "text",
	format = noop,
	load = noop,
	serialize = noop,
	required = false,
	autoFocus = false,
	readOnly = false,
	validation = {},
	defaultValue,
	size = 20,
	placeHolder = "",
	...moreProps
}) => {
	// Find the form validation context to register our input
	const inputRef = createRef();
	const { register, errors, setData, getData, validate } = useFormValidationContext();

	const errorMessage = errors[name]?.message || "";
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Pass the required attribute to the validation object
	if (required) label += "*";

	// Register our Input so that the validation can take effect
	register(name, { inputRef, required, defaultValue, validation });

	// We store 2 distinct values : the real one
	// and the displayed (formatted) value for the visible TextField
	const [displayedValue, setDisplayedValues] = useState(format(load(getData(name))));
	const onChange = (evt) => {
		const formattedInputParts = format(evt.target.value); // format can return an array to tell the correct cursor position
		setDisplayedValues(formattedInputParts);
		const formatted = Array.isArray(formattedInputParts)
			? formattedInputParts.join("")
			: formattedInputParts;
		setData(name, serialize(formatted));
		if (errorMessage) {
			validate(name); // Show when the input become valid again
		}
	};

	useLayoutEffect(() => {
		// inputRef.current.value = format(load(getData(name))); // Load and format the default value
		// Formatted controls are controled
		// value = format(load(getData(name))); // Load and format the default value
		if (autoFocus || errorMessage) {
			console.log(`Focus on ${name} (${errorMessage})`);
			inputRef.current.focus();
		}
	}, [name]); // Only at first load

	useEffect(() => {
		if (Array.isArray(displayedValue)) {
			inputRef.current.selectionStart = inputRef.current.selectionEnd =
				displayedValue[0].length;
		} else if (displayedValue && displayedValue.length) {
			inputRef.current.selectionStart = inputRef.current.selectionEnd =
				displayedValue.length;
		}
	}, [displayedValue]);

	// This Text field has no name : he doesn't submit any data of his own
	// The real data is set on the onChange event and set on tje Form Validation Context
	return (
		<TextField
			id={`formatted-${name}`}
			inputRef={inputRef}
			label={label}
			placeholder={placeHolder}
			value={
				Array.isArray(displayedValue) ? displayedValue.join("") : displayedValue
			}
			onChange={onChange}
			// autoFocus={autoFocus}
			error={Boolean(errorMessage)}
			helperText={helperText || errorMessage}
			inputProps={{
				size,
				readOnly
			}}
			{...mergedProps}
		/>
	);
};

export default Formatted;
