import { createRef, useState, useEffect, useLayoutEffect } from "react";
import { TextField } from "@material-ui/core";
import { useFormValidationContext } from "../validation/FormValidationProvider";
import { evalContextualProp } from "../validation/utils";
import _BASE_INPUT_STYLES from "./styles";

const noop = (val) => val;

/**
 * @typedef FormattedInputProps
 * @property {String} name The name of the field (can use dots to describe a deeply nested property)
 * @property {String} label The field label
 * @property {Function} format a function that takes the current input of the field and reformat it
 * @property {Function} serialize a function that takes formatted input of the field and serialize it to its actual storage format
 * @property {Boolean} [required=false] required
 * @property {Boolean} [disabled=false] disabled (cannot be edited)
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
	disabled = false,
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
	const {
		register,
		data,
		errors,
		setData,
		getData,
		validate
	} = useFormValidationContext();

	const errorMessage = errors[name]?.message || "";
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Pass the required attribute to the validation object
	if (evalContextualProp(data, required)) label += "*";

	// Register our Input so that the validation can take effect
	register(name, { inputRef, required, defaultValue, validation });

	// Use a local state for the displayed (formatted) value
	const [displayedValue, setDisplayedValues] = useState(format(load(getData(name))));
	const [firstDisplay, setFirstDisplay] = useState(true);

	// Re-format on every modification and send teh real value to the Validation Context
	const onChange = (evt) => {
		const formattedInputParts = format(evt.target.value); // format can return an array to tell the correct cursor position
		setDisplayedValues(formattedInputParts);
		const formatted = Array.isArray(formattedInputParts)
			? formattedInputParts.join("")
			: formattedInputParts;
		setData(name, serialize(formatted));
		if (errorMessage) {
			validate(name); // Show when the input becomes valid again
		}
	};

	useLayoutEffect(() => {
		if (autoFocus || errorMessage) {
			console.log(`Focus on ${name} (${displayedValue})`);
			inputRef.current.focus();
			if (typeof displayedValue === "string" && displayedValue.length) {
				inputRef.current.setSelectionRange(0, displayedValue.length);
			} else if (Array.isArray(displayedValue)) {
				inputRef.current.setSelectionRange(0, displayedValue[0].length);
			}
		}
	}, [name]); // Only on first load

	useEffect(() => {
		if (firstDisplay) {
			setFirstDisplay(false);
			return; // We want a full selected input on focus
		}
		// Set the cursor position between the 2 returned parts of the displayedValue
		console.log(`Setting cursor position on edited value`);
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
			disabled={evalContextualProp(data, disabled)}
			error={Boolean(errorMessage)}
			helperText={errorMessage || helperText}
			InputProps={{
				size,
				readOnly
			}}
			{...mergedProps}
		/>
	);
};

export default Formatted;
