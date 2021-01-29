// Formatted.stories.js
import Formatted from "./Formatted";
import {
	useFormValidationContext,
	FormValidationProvider
} from "@forms/validation/FormValidationProvider";
import useFormStyles from "../useFormStyles";

/**
 * Allow only A-Z letters and 0-9 digits
 * + Convert letters to uppercase
 * @param {String} input
 */
const uppercaseAlpha = (input = "") => input.replace(/[^a-z\d]+/gi, "").toUpperCase();

const VForm = ({ children, ...props }) => {
	const styles = useFormStyles();
	const { validate } = useFormValidationContext();

	// Just log what's goin on when submitting
	const onSubmit = (evt) => {
		evt.preventDefault();
		validate({
			onSuccess: console.log,
			onError: console.error
		});
	};

	return (
		<form onSubmit={onSubmit} className={styles.form} {...props}>
			{children}
			<input type="submit" className="hidden" aria-hidden="true" />
		</form>
	);
};

// This default export determines where your story goes in the story list
export default {
	title: "Formatted Input with validation",
	component: Formatted,
	args: {
		required: false,
		autoFocus: true,
		readOnly: false,
		defaultValue: ""
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: "text" } }
	}
};

export const AlphaUppercaseFormatted = ({ ...args }) => (
	<FormValidationProvider>
		<VForm id="simple-text-form">
			<Formatted
				{...args}
				helperText="Accepts only letters and digits"
				name="code"
				label="Code"
				format={uppercaseAlpha}
			/>
		</VForm>
	</FormValidationProvider>
);

export const ReadOnlyFormattedWithData = ({ ...args }) => (
	<FormValidationProvider data={{ firstName: "John" }}>
		<VForm id="simple-text-form">
			<Formatted {...args} name="firstName" label="Prénom" />
		</VForm>
	</FormValidationProvider>
);
ReadOnlyFormattedWithData.args = {
	readOnly: true
};
