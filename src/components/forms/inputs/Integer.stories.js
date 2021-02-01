// Integer.stories.js
import Integer from "./Integer";
import { FormValidationProvider } from "@forms/validation/FormValidationProvider";
import { VForm } from "../validation/VForm";

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
				helperText="Entrez un chiffre"
				name="count"
				label="Compte"
			/>
		</VForm>
	</FormValidationProvider>
);

export const MoreIntegerInputs = ({ unit, ...args }) => (
	<FormValidationProvider data={{ cp: "12345" }}>
		<VForm id="multiple-integer-inputs">
			<Integer
				{...args}
				helperText="Restricted to plage 0-10000"
				name="many"
				label="Quantity"
				plage={[0, 10000]}
			/>
			<Integer
				{...args}
				required={true}
				helperText="Use a prefix unit"
				name="donation_dollars"
				label="Donation ($)"
				prefix="$"
			/>
			<Integer
				{...args}
				required={true}
				helperText="Use a suffix unit"
				name="donation_euros"
				label="Donation (€)"
				suffix=" €"
			/>
		</VForm>
	</FormValidationProvider>
);
MoreIntegerInputs.args = {
	unit: "€"
};
