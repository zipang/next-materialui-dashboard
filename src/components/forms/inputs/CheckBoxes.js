import { createRef, useState, useEffect, useLayoutEffect } from "react";
import { Checkbox as MaterialCheckbox, FormControlLabel, Grid } from "@material-ui/core";
import GroupLabel from "@forms/GroupLabel";
import { useFormValidationContext } from "@forms/validation/FormValidationProvider";
import { convertOptions } from "@forms/validation/utils";
import _BASE_INPUT_STYLES from "./styles";

/**
 * @typedef CheckBoxesProps
 * @field {String} name
 * @field {String} label
 * @field {Array|Object} options Available options to choose from (code + label) or map
 */
/**
 * A group of checkboxes used to display an array of possible values
 * @param {CheckBoxesProps} props
 */
const CheckBoxes = ({
	name = "checkbox",
	label = "",
	options = [],
	required = false,
	autoFocus = false,
	defaultValue = [],
	validation = {},
	width = 1 / 3, // checkboxes are arranged in 3 columns
	...moreProps
}) => {
	const inputRef = createRef(); // This ref will reference the first checkbox in the serie

	// Find the Form Validation Context to register our input
	const { register, errors, setData, getData, validate } = useFormValidationContext();

	// Register our Input so that the validation can take effect
	register(name, { inputRef, required, defaultValue, validation });

	// Get the current checked values from the ValidationContext
	const [values, setValues] = useState(getData(name));

	// This field value is in fact an array of values corresponding to checked elements
	const mergedProps = { ..._BASE_INPUT_STYLES, ...moreProps };

	// Accept a hashmap (key : value) as different format
	if (!Array.isArray(options)) options = convertOptions(options);

	/**
	 * When a single checkbox change : add or remove the value from the list
	 * @param {Event} evt
	 */
	const onChange = (evt) => {
		const valueToToggle = evt.target.value;
		if (values.includes(valueToToggle)) {
			setData(
				name,
				values.filter((val) => val !== valueToToggle)
			);
		} else {
			setData(name, [...values, valueToToggle]);
		}
		setValues(getData(name));
		if (evt.key === "Enter" && !evt.shiftKey) {
			validate();
		}
	};

	useLayoutEffect(() => {
		if (autoFocus) {
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<GroupLabel label={label}>
			<Grid container>
				{options.map(({ code, label }, i) => {
					if (i === 0) {
						return (
							<Grid item sm={Number(width * 12)}>
								<FormControlLabel
									label={label}
									key={`${name}:${code}-label`}
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
								/>
							</Grid>
						);
					} else {
						return (
							<Grid item sm={Number(width * 12)}>
								<FormControlLabel
									label={label}
									control={
										<MaterialCheckbox
											name={`${name}:${code}`}
											key={`${name}:${code}`}
											value={code}
											checked={values.includes(code)}
											onChange={onChange}
										/>
									}
								/>
							</Grid>
						);
					}
				})}
			</Grid>
		</GroupLabel>
	);
};

export default CheckBoxes;
