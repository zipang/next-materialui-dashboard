import React, { createRef, useEffect, useLayoutEffect } from "react";
import { TextField } from "@material-ui/core";
import { useFormValidationContext } from "../validation/FormValidationProvider";
import _BASE_INPUT_STYLES from "./styles";

/**
 * @typedef TextInputProps
 * @property {String} name The name of the field (can use dots to describe a deeply nested property)
 * @property {String} label The field label
 * @property {Boolean} [required=false] Value required
 * @property {String}  [placeHolder] Text shown before any input
 * @property {Boolean} [autoFocus=false] Get focus on this field on page load ?
 * @property {Boolean} [readOnly=false] Can or cannot edit
 * @property {Object} [validation={}] Validation object
 */

/**
 * Basically same features as Text input
 * but with validation
 * @param {TextInputProps} props -
 */
const Text = ({
	name = "text",
	label = "Text",
	placeHolder,
	required = false,
	defaultValue = "",
	autoComplete = false,
	autoFocus = false,
	readOnly = false,
	validation = {},
	...moreProps
}) => {
	// Find the form validation context to register our input
	const inputRef = createRef();
	const { register, errors, setData, getData, validate } = useFormValidationContext();

	const errorMessage = errors[name]?.message || "";
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Pass the required attribute to the validation object
	if (required) label += "*";

	// Keep form context data in sync
	const onChange = (evt) => {
		setData(name, evt.target.value);
		if (errorMessage) {
			validate(name); // Show when the input becomes valid again
		}
	};

	// Register our Input so that the validation can take effect
	register(name, { inputRef, required, defaultValue, validation });

	useEffect(() => {
		console.log(`Re-rendering text field ${name}`);
	}, [name]);

	useLayoutEffect(() => {
		inputRef.current.value = getData(name); // Apply the default value
		if (autoFocus || errorMessage) {
			console.log(`Focus on ${name} (${errorMessage})`);
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<TextField
			id={name}
			inputRef={inputRef}
			name={name}
			label={label}
			onChange={onChange}
			error={Boolean(errorMessage)}
			autoComplete={autoComplete ? "" : "off"}
			autoFocus={autoFocus}
			helperText={errorMessage}
			fullWidth={true}
			InputProps={{
				readOnly,
				placeholder: placeHolder
			}}
			{...mergedProps}
		/>
	);
};

export default Text;
