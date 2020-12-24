// Input.stories.js
import Input from "./Input";
import StepForm from "./StepForm";

// This default export determines where your story goes in the story list
export default {
	title: "Input",
	component: Input,
	args: {
		required: false,
		label: "Let's input some number"
	},
	argTypes: {
		required: { control: { type: "boolean" } }
	}
};

export const IntegerInput = (args) => (
	<StepForm>
		<Input.Integer autoFocus={true} {...args} />
	</StepForm>
);
IntegerInput.args = {
	separator: " "
};
IntegerInput.argTypes = {
	separator: {
		control: {
			type: "select",
			options: [" ", "'", "."]
		}
	}
};

export const PercentInput = (args) => (
	<StepForm mode="onChange">
		<Input.Percent autoFocus={true} name="percent" {...args} />
	</StepForm>
);
PercentInput.args = {
	label: "Saisissez un pourcentage"
};

export const DateInput = (args) => (
	<StepForm mode="onChange">
		<Input.Date autoFocus={true} required name="date" {...args} />
	</StepForm>
);
DateInput.args = {
	label: "Entrez une date",
	dateFormat: "dd/mm/yyyy"
};
DateInput.argTypes = {
	dateFormat: {
		control: { type: "select", options: ["dd/mm/yyyy", "mm-dd-yyyy", "yyyy-mm-dd"] }
	}
};

export const DateInputWithData = (args) => (
	<StepForm data={{ date: "2020-12-01" }}>
		<Input.Date readOnly name="date" {...args} />
	</StepForm>
);
DateInputWithData.args = {
	label: "Date de création"
};
DateInputWithData.argTypes = {};
