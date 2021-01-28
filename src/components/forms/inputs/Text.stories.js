// Text.stories.js
import Text from "./Text";
import { withFormValidationContext } from "@forms/validation/FormValidationProvider";

const VForm = ({ children, ...options }) =>
	withFormValidationContext("form", options)({ children });

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
		readOnly: { control: { type: "boolean" } }
	}
};

export const SimpleText = (args) => (
	<VForm defaultValues={{ firstName: "Jean" }}>
		<Text {...args} name="firstName" label="Prénom" />
	</VForm>
);
