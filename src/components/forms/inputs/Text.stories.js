// Text.stories.js
import Text from "./Text";
import {
	useFormValidationContext,
	FormValidationProvider
} from "@forms/validation/FormValidationProvider";
import useFormStyles from "../useFormStyles";

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
	title: "Text Input with validation",
	component: Text,
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

export const SimpleText = ({ defaultValue, ...args }) => (
	<FormValidationProvider>
		<VForm id="simple-text-form">
			<Text
				{...args}
				defaultValue={defaultValue}
				helperText="With default value"
				name="firstName"
				label="Prénom"
			/>
			<Text {...args} placeHolder="Valjean" name="lastName" label="Nom" />
		</VForm>
	</FormValidationProvider>
);
SimpleText.args = {
	defaultValue: "Jean"
};

export const ReadOnlyTextWithData = ({ ...args }) => (
	<FormValidationProvider data={{ firstName: "John" }}>
		<VForm id="simple-text-form">
			<Text {...args} name="firstName" label="Prénom" />
		</VForm>
	</FormValidationProvider>
);
ReadOnlyTextWithData.args = {
	readOnly: true
};
