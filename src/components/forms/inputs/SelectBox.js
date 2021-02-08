import { createRef } from "react";
import {
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	FormHelperText
} from "@material-ui/core";
import { useFormValidationContext } from "@forms/validation/FormValidationProvider";
import { convertOptions } from "@forms/validation/utils";
import _BASE_INPUT_STYLES from "./styles";

/**
 * Select a value amonst one defined list of options
 * @param {SelectBoxProps} props
 */
const SelectBox = ({
	name = "select-box",
	label = "",
	required = false,
	defaultValue = "",
	helperText = "",
	autoFocus = false,
	validation = {},
	options = [],
	...moreProps
}) => {
	const inputRef = createRef(); // This ref will reference the first checkbox in the serie

	// Pass the required attribute to the validation object
	if (required) label += "*";

	// Accept a hashmap (key : value) as different format
	if (!Array.isArray(options)) options = convertOptions(options);
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Find the Form Validation Context to register our input
	const { register, errors, setData, getData, validate } = useFormValidationContext();

	// Register our Input so that the validation can take effect
	register(name, { inputRef, required, defaultValue, validation });

	const selectedValue = getData(name, ""); // Material UI Select has a problem with null or undefined values
	const errorMessage = errors[name]?.message || "";

	const onChange = (evt) => {
		setData(name, evt.target.value || null);
		console.log(`Changing ${name} selected value to ${evt.target.value}`);
		if (errorMessage) {
			validate(name); // Show when the input becomes valid again
		}
	};

	return (
		<FormControl
			margin="dense"
			style={{ marginTop: 0 }}
			error={Boolean(errorMessage)}
		>
			<InputLabel id={`${name}-label`}>{label}</InputLabel>
			<Select
				id={name}
				labelId={`${name}-label`}
				inputRef={inputRef}
				defaultValue={selectedValue} // We use an uncontrolled component this way
				onChange={onChange}
				autoFocus={autoFocus}
				className="MuiFormControl-marginDense MuiFormControl-fullWidth"
				fullWidth={true}
				{...mergedProps}
			>
				{!required && (
					<MenuItem key={`${name}-empty-option`} value="">
						&nbsp;
					</MenuItem>
				)}
				{options.map((option) => (
					<MenuItem key={option.code} value={option.code}>
						{option.label}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>{errorMessage || helperText}</FormHelperText>
		</FormControl>
	);
};

export default SelectBox;
