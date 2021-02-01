// Percent.stories.js
import Percent from "./Percent";
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
	title: "Percent Input with validation",
	component: Percent,
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

export const ReadOnlyPercent = ({ ...args }) => (
	<FormValidationProvider data={{ proportion: 50 }}>
		<VForm id="simple-integer-form">
			<Percent
				{...args}
				helperText="Read Only"
				name="proportion"
				label="Proportion"
			/>
		</VForm>
	</FormValidationProvider>
);
ReadOnlyPercent.args = {
	readOnly: true
};

export const SomePercentages = ({ unit, ...args }) => (
	<FormValidationProvider data={{ proportion: 75 }}>
		<VForm id="multiple-integer-inputs">
			<Percent
				{...args}
				helperText="Restricted to 0-100"
				name="proportion"
				label="Proportion"
				strict={true}
			/>
			<Percent
				{...args}
				required={true}
				helperText="Not restricted"
				name="performance"
				label="Performance"
			/>
		</VForm>
	</FormValidationProvider>
);
