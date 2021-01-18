// Input.stories.js
import Input from "./Input";
import StepForm from "./StepForm";

// This default export determines where your story goes in the story list
export default {
	title: "Input",
	component: Input,
	args: {
		required: false,
		autoFocus: true
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } }
	}
};

export const IntegerInput = (args) => (
	<StepForm>
		<Input.Integer {...args} />
	</StepForm>
);
IntegerInput.args = {
	label: "Nombre",
	plage: [0, 1000000],
	separator: " "
};
IntegerInput.argTypes = {
	separator: {
		control: {
			type: "select",
			options: [" ", "'", "."]
		}
	},
	plage: {
		control: {
			type: "json"
		}
	}
};

/**
 * Input a percentage ([0-100])
 * @param {Object} args
 */
export const PercentInput = (args) => (
	<StepForm mode="onChange">
		<Input.Percent name="percent" {...args} />
	</StepForm>
);
PercentInput.args = {
	label: "%"
};

export const DateInput = (args) => (
	<StepForm mode="onChange">
		<Input.Date name="date" {...args} />
	</StepForm>
);
DateInput.args = {
	label: "Date",
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

export const SelectBoxInput = (args) => (
	<StepForm mode="onChange">
		<Input.SelectBox autoFocus={true} required name="genre" {...args} />
	</StepForm>
);
SelectBoxInput.args = {
	label: "Genre",
	options: [
		{ code: "M", label: "Monsieur" },
		{ code: "F", label: "Madame" }
	]
};
SelectBoxInput.argTypes = {
	options: {
		control: { type: "json" }
	}
};

export const SelectBoxInputWithHashmap = (args) => (
	<StepForm mode="onChange">
		<Input.SelectBox autoFocus={true} required name="genre" {...args} />
	</StepForm>
);
SelectBoxInputWithHashmap.args = {
	label: "Genre",
	options: { M: "Monsieur", F: "Madame" }
};
SelectBoxInputWithHashmap.argTypes = {
	options: {
		control: { type: "json" }
	}
};

export const CheckBoxInput = (args) => (
	<StepForm mode="onChange">
		<Input.CheckBox
			autoFocus={true}
			name="certifications"
			valueIfChecked="gold"
			label="Gold Crown"
		/>
		<Input.CheckBox
			name="certifications"
			valueIfChecked="green"
			label="Green Label"
		/>
		<Input.CheckBox name="certifications" valueIfChecked="bio" label="Bio Ethique" />
	</StepForm>
);
CheckBoxInput.args = {};
CheckBoxInput.argTypes = {};

export const CheckBoxesInput = (args) => (
	<StepForm mode="onChange">
		<Input.CheckBoxes
			autoFocus={true}
			name="musical_genres"
			label="Genres Musicaux"
			{...args}
		/>
	</StepForm>
);
CheckBoxesInput.args = {
	options: {
		rock: "Rock",
		blues: "Blues",
		funk: "Funk",
		hiphop: "Hip-Hop",
		jazz: "Jazz",
		classic: "Classique",
		punk: "Punk",
		disco: "Disco",
		electro: "Electro"
	}
};
CheckBoxesInput.argTypes = {
	control: { type: "json" }
};
