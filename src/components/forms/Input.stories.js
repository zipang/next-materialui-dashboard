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

/**
 * Input an URL
 * @param {Object} args
 */
export const UrlInput = (args) => (
	<StepForm mode="onChange">
		<Input.Url name="site_web" {...args} />
	</StepForm>
);
UrlInput.args = {
	label: "URL"
};

/**
 * Input a telephone number
 * @param {Object} args
 */
export const TelInput = (args) => (
	<StepForm mode="onChange">
		<Input.Tel name="tel" {...args} />
	</StepForm>
);
TelInput.args = {
	label: "Téléphone",
	format: "99 99 99 99 99"
};
TelInput.argTypes = {
	format: {
		control: {
			type: "select",
			options: ["99 99 99 99 99", "+(99) 9 99 99 99 99"]
		}
	}
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

export const SwitchInput = (args) => (
	<StepForm mode="onChange">
		<Input.Switch name="activated" label="Activation" />
		<Input.Switch
			autoFocus={true}
			name="power"
			values={["ON", "OFF"]}
			label="On/Off"
		/>
	</StepForm>
);
SwitchInput.args = {};
SwitchInput.argTypes = {};

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
