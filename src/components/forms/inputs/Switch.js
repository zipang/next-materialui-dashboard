import { createRef, useLayoutEffect, useState } from "react";
import { Switch as MaterialSwitch, FormControlLabel } from "@material-ui/core";
import { useFormValidationContext } from "../validation/FormValidationProvider";
import _BASE_INPUT_STYLES from "./styles";

/**
 * @typedef SwitchProps
 * @param {String} name
 * @param {String} label
 * @param {Array<checked,unchecked>} values The values to apply when the switch is activated/disactivated
 */
/**
 * This Switch has only two possible values (on/off) and no undefined state
 * The real `values` can be provided as an array, if not they are equal to the boolean values : [false,true]
 * The default state is the inactivated one, it corresponds to the first value passed to `values`
 * @param {SwitchProps} props
 */
const Switch = ({
	name = "radio",
	label = "Y/N",
	values = [false, true],
	autoFocus = false,
	...moreProps
}) => {
	// Find the form validation context to register our input
	const inputRef = createRef();
	const { register, setData, getData, validate } = useFormValidationContext();

	// Register our Input so that the validation can take effect
	register(name, { inputRef, defaultValue: values[0], validation: {} });

	// Load the initial value from the Validation Context
	const [selectedValue, setSelectedValue] = useState(getData(name));

	const onChange = (evt) => {
		const selectedValue = evt.target.checked ? values[1] : values[0];
		setData(name, selectedValue);
		setSelectedValue(selectedValue);
		if (evt.key === "Enter" && !evt.shiftKey) {
			validate(name);
		}
	};

	useLayoutEffect(() => {
		if (autoFocus) {
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<FormControlLabel
			control={
				<MaterialSwitch
					inputRef={inputRef}
					checked={selectedValue === values[1]}
					onChange={onChange}
					{...moreProps}
				/>
			}
			label={label}
		/>
	);
};

export default Switch;
