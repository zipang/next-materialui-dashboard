// Date.stories.js
import Date from "./Date";
import { FormValidationProvider } from "@forms/validation/FormValidationProvider";
import { VForm } from "@forms/validation/VForm";

const today = "2021-02-01"; //new Date().toISOString().substr(0, 10);

// This default export determines where your story goes in the story list
export default {
	title: "Date Input with validation",
	component: Date,
	args: {
		required: false,
		autoFocus: true,
		readOnly: false,
		defaultValue: null,
		errorMessage: "Date Invalide",
		format: "dd/mm/yyyy"
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: null } },
		name: { control: { type: null } },
		label: { control: { type: null } },
		format: {
			control: {
				type: "select",
				options: ["dd/mm/yyyy", "mm-dd-yyyy", "yyyy-mm-dd"]
			}
		}
	}
};

export const SimpleDateOutput = ({ ...args }) => (
	<FormValidationProvider>
		<VForm id="simple-date-input" data={{ today }}>
			<Date
				{...args}
				helperText="Try changing the format"
				name="today"
				label="Today"
			/>
		</VForm>
	</FormValidationProvider>
);

export const MoreDateInputs = ({ prefix, suffix, ...args }) => (
	<FormValidationProvider data={{ today }}>
		<VForm id="more-date-inputs">
			<Date
				{...args}
				readOnly={true}
				helperText="Read only"
				name="today"
				label={`Today`}
			/>
			<Date
				{...args}
				helperText="Tip : try a date below 1900"
				name="birthdate"
				label="Birthdate"
				validation={{
					tooOld: (str) => (str < "1900-01-01" ? "You are way too old" : true)
				}}
			/>
			<Date
				{...args}
				required={true}
				helperText="Guess the day"
				name="independance_day"
				label={`Independance Day`}
				validation={{
					incorrect: {
						pattern: /^[\d]{4}-07-04$/,
						message: "Wrong guess"
					}
				}}
			/>
		</VForm>
	</FormValidationProvider>
);
