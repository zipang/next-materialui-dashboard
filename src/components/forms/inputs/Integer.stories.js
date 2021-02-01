// Integer.stories.js
import Integer from "./Integer";
import {
	useFormValidationContext,
	FormValidationProvider
} from "@forms/validation/FormValidationProvider";
import useFormStyles from "../useFormStyles";

const onlyDigits = (length) => (input = "") =>
	input.replace(/[^\d]+/gi, "").substr(0, length);

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
	title: "Integer Input with validation",
	component: Integer,
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

export const SimpleInteger = ({ ...args }) => (
	<FormValidationProvider>
		<VForm id="simple-integer-form">
			<Integer
				{...args}
				helperText="Entre un chiffre"
				name="value"
				label="Shoupi"
			/>
		</VForm>
	</FormValidationProvider>
);

export const HowManyDigits = ({ unit, ...args }) => (
	<FormValidationProvider data={{ cp: "12345" }}>
		<VForm id="multiple-integer-inputs">
			<Integer
				{...args}
				helperText="Restricted to plage 0-10000"
				name="many"
				label="Guess how many"
				plage={[0, 10000]}
			/>
			<Integer
				{...args}
				required={true}
				helperText="Use any unit"
				name="donation"
				label="Donation"
				unit={unit}
			/>
		</VForm>
	</FormValidationProvider>
);
HowManyDigits.args = {
	unit: "€"
};
