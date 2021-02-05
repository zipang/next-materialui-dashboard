// SelectBox.stories.js
import SelectBox from "./SelectBox";
import { FormValidationProvider } from "@forms/validation/FormValidationProvider";
import VForm from "@forms/validation/VForm";
import { Button } from "@material-ui/core";

const musicOptions = {
	rock: "Rock",
	punk: "Punk",
	indie: "Indie Rock",
	garage: "Garage",
	soul: "Soul",
	funk: "Funk",
	jazz: "Jazz",
	easy: "Easy Listening",
	kpop: "KPop",
	jpop: "JPop"
};
const saucesOptions = [
	{ code: "oyster", label: "Sauce Huitre" },
	{ code: "gingember", label: "Sauce Gingembre" },
	{ code: "garlic", label: "Sauce Ail" },
	{ code: "ketchup", label: "Sauce Ketchup" },
	{ code: "bbq", label: "Sauce BBQ (épuisée)" }
];

// This default export determines where your story goes in the story list
export default {
	title: "SelectBox Input with validation",
	component: SelectBox,
	args: {
		required: false,
		autoFocus: true,
		readOnly: false
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: "select", options: Object.keys(musicOptions) } },
		validation: { control: { type: null } },
		name: { control: { type: null } },
		label: { control: { type: null } }
	}
};

export const SimpleSelectBoxOutput = ({ ...args }) => (
	<FormValidationProvider>
		<VForm id="basic-select-choice">
			<SelectBox
				{...args}
				name="choices.music"
				label="Choose your music"
				helperText="Look at the log for the data"
				options={musicOptions}
			/>
			<Button type="submit" variant="contained" color="primary">
				Valider
			</Button>
		</VForm>
	</FormValidationProvider>
);

export const MoreSelectBoxInputs = ({ prefix, suffix, ...args }) => (
	<FormValidationProvider data={{ choices: { music: "punk", sauce: "bbq" } }}>
		<VForm id="more-select-choices">
			<SelectBox
				{...args}
				name="choices.music"
				label="Your music choices"
				readOnly={true}
				options={musicOptions}
				helperText="Read only"
			/>
			<SelectBox
				{...args}
				name="choices.sauce"
				label="Choose a sauce"
				options={saucesOptions}
				validation={{
					outOfStock: (choice) => (choice === "bbq" ? "Out of Stock" : true)
				}}
			/>
			<Button type="submit" variant="contained" color="primary">
				Valider
			</Button>
		</VForm>
	</FormValidationProvider>
);
