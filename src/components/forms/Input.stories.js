// Input.stories.js
import Input from "./Input";
import DForm from "./DForm";

// This default export determines where your story goes in the story list
export default {
	title: "Input",
	component: Input,
	args: {
		label: "Let's input some number"
	}
};

export const IntegerInput = (args) => (
	<DForm>
		<Input.Integer {...args} />
	</DForm>
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
	<DForm mode="onChange">
		<Input.Percent label="Pourcentage" name="percent" {...args} />
	</DForm>
);
PercentInput.args = {
	required: false
};
PercentInput.argTypes = {
	required: { control: { type: "boolean" } }
};

export const DateInput = (args) => (
	<DForm mode="onChange">
		<Input.Date name="date" {...args} />
	</DForm>
);
DateInput.args = {
	label: "Entrez une date",
	required: false,
	dateFormat: "dd/mm/yyyy"
};
DateInput.argTypes = {
	required: { control: { type: "boolean" } },
	dateFormat: {
		control: { type: "select", options: ["dd/mm/yyyy", "mm-dd-yyyy", "yyyy-mm-dd"] }
	}
};
