import { createRef, useLayoutEffect } from "react";
import {
	RadioGroup,
	Radio as MaterialRadio,
	FormLabel,
	FormControl,
	FormHelperText,
	FormControlLabel
} from "@material-ui/core";
import { useFormValidationContext } from "../validation/FormValidationProvider";
import { convertOptions } from "./utils";
import _BASE_INPUT_STYLES from "./styles";
import { isUndefined, noop } from "../validation/utils";

/**
 * @typedef RadioProps
 * @param {String} name
 * @param {String} label
 * @field {Array|Object} options Available options to choose from (code + label) or map
 */
/**
 * The Radio has several options to choose from.
 * One selection is always required.
 * The first option is always selected if the `defaultValue` is not passed
 * @example
 *   <Radio name="gender" label="Gender" options={{ M:"Male", F:"Female "}} />
 * @param {RadioProps} props
 */
const Radio = ({
	name = "radio",
	label = "",
	helperText = "",
	options = [],
	defaultValue,
	load = noop,
	serialize = noop,
	autoFocus = false,
	readOnly = false,
	validation = {},
	size = 1 / 3,
	...moreProps
}) => {
	// Find the form validation context to register our input
	const inputRef = createRef();
	const { register, setData, getData, validate, errors } = useFormValidationContext();

	// Accept a hashmap (key : value) as different format
	if (!Array.isArray(options)) options = convertOptions(options);

	// Select the first value by default
	if (isUndefined(defaultValue)) defaultValue = options[0].code;

	// Do not focus on read-only items
	if (readOnly) autoFocus = false;

	// Register our Input so that the validation can take effect
	register(name, { inputRef, defaultValue, validation });

	// Load the initial value from the Validation Context
	const selectedValue = load(getData(name));
	const errorMessage = errors[name]?.message || "";

	const onChange = (evt) => {
		const selectedValue = evt.target.value;
		setData(name, serialize(selectedValue));
		if (errorMessage) {
			validate(name); // Show when the selection becomes valid again
		}
	};

	useLayoutEffect(() => {
		if (autoFocus) {
			inputRef.current?.focus();
		}
	}, [name]);

	return (
		<FormControl
			component="fieldset"
			readOnly={readOnly}
			error={Boolean(errorMessage)}
		>
			{label && (
				<FormLabel className="radioLabel" component="legend">
					{label}
				</FormLabel>
			)}
			<RadioGroup
				row
				aria-label={label}
				name={name}
				// autoFocus={autoFocus}
				defaultValue={selectedValue}
				onChange={onChange}
				{...moreProps}
			>
				{options.map(({ code, label }, i) =>
					i === 0 ? (
						<FormControlLabel
							key={`${name}-${code}`}
							inputRef={inputRef}
							autoFocus={autoFocus}
							value={code}
							control={<MaterialRadio />}
							label={label}
						/>
					) : (
						<FormControlLabel
							key={`${name}-${code}`}
							value={code}
							control={<MaterialRadio />}
							label={label}
						/>
					)
				)}
			</RadioGroup>
			<FormHelperText>{errorMessage || helperText}</FormHelperText>
		</FormControl>
	);
};

export default Radio;
