// YesNo.stories.js
import YesNo from "./YesNo";
import { FormValidationProvider } from "@forms/validation/FormValidationProvider";
import VForm from "@forms/validation/VForm";
import Submit from "./Submit";

const OuiNon = YesNo("Oui", "Non");
const YSN = YesNo();

// This default export determines where your story goes in the story list
export default {
	title: "YesNo Input with validation",
	component: YesNo,
	args: {
		autoFocus: true,
		readOnly: false,
		defaultValue: false
	},
	argTypes: {
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: "boolean" } },
		name: { control: { type: null } },
		label: { control: { type: null } }
	}
};

export const SimpleYesNoOutput = ({ ...args }) => (
	<FormValidationProvider>
		<VForm id="simple-ysn">
			<YSN
				{...args}
				name="choices.icecream"
				autoFocus={true}
				label="Do you like ice cream ?"
			/>
			<OuiNon {...args} name="choices.glace" label="Aimez-vous les glaces ?" />
		</VForm>
	</FormValidationProvider>
);

export const MoreYesNoInputs = ({ prefix, suffix, ...args }) => (
	<FormValidationProvider
		data={{ choices: { icecream: true, glaces: true, fish: false } }}
	>
		<VForm id="more-checkboxes-inputs">
			<YSN
				{...args}
				name="choices.icecream"
				label="Do you like ice-cream?"
				readOnly={true}
				helperText="Read only"
			/>
			<OuiNon
				{...args}
				name="choices.glaces"
				label="Aimez-vous les glaces ?"
				readOnly={true}
				helperText="Read only"
			/>
			<OuiNon
				{...args}
				name="choices.fish"
				label="Aimez-vous le poisson surgelé ?"
			/>
			<Submit />
		</VForm>
	</FormValidationProvider>
);
