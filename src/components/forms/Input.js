import { TextField, Button, Select, MenuItem } from "@material-ui/core";
import { useFormContext } from "react-hook-form";

const MATERIAL_UI_STYLE = {
	variant: "outlined",
	fullWidth: true,
	fontSize: "large",
	margin: "normal"
};

/**
 * @typedef InputProps
 * @field {String} name The name of the field (can use dots to describe a deeply nested property)
 * @field {String} label The field label
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
	label = "label",
	autoComplete = false,
	autoFocus = false,
	validation = {},
	...moreProps
}) => {
	// Find the parent form to register our input
	const { register, errors } = useFormContext();
	const mergedProps = { ...MATERIAL_UI_STYLE, ...moreProps };
	if (validation.required) label += "*";
	return (
		<TextField
			name={name}
			id={name}
			label={label}
			error={Boolean(errors[name])}
			inputRef={register(validation)}
			margin="dense"
			autoComplete={autoComplete ? "" : "off"}
			autoFocus={autoFocus}
			helperText={errors[name] ? errors[name].message : " "}
			// required={Boolean(validation.required)}
			{...mergedProps}
		/>
	);
};

/**
 * Take everything from Input.Text but change type to password
 * @param {JSX.} props
 */
const Password = ({ ...props }) => <Text type="password" {...props} />;

const numberDefaults = {
	type: "number"
};
const Number = ({ ...props }) => <Text type="number" {...props} />;

const Email = ({ validation = {}, ...props }) => {
	const emailValidation = {
		...validation,
		pattern: {
			value: /^.+@.+\..+$/,
			message: "Email invalide"
		}
	};
	return <Text validation={emailValidation} {...props} />;
};

const SelectBox = ({ options = [], ...props }) => {
	return (
		<Text select={true} {...props}>
			{options.map((option) => (
				<MenuItem value={option.code}>{option.label}</MenuItem>
			))}
		</Text>
	);
};

const Submit = ({ label = "OK" }) => (
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
	Submit
};

export default Input;
