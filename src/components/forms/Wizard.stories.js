// Wizard.stories.js
import Wizard from "./Wizard";
import Input from "./Input";
import StepForm from "./StepForm";
import { useStateMachine } from "../StateMachine";
import { Box } from "@material-ui/core";

const empty_data = {};
const existing_data = {
	firstName: "Elric",
	age: 23,
	classe: "magician"
};

/**
 * Create a simple displayForm function wich renders
 * a StepForm with a unique input element
 */
const simpleStepForm = ({ name, type = "text", ...more }) => (data, onSubmit) => {
	return (
		<StepForm formId={name} data={data} onSubmit={onSubmit}>
			{type === "text" && <Input.Text autoFocus={true} name={name} {...more} />}
			{type === "select" && (
				<Input.SelectBox autoFocus={true} name={name} {...more} />
			)}
			{type === "number" && (
				<Input.Integer autoFocus={true} name={name} {...more} />
			)}
		</StepForm>
	);
};

// Create some dummy steps to display
const steps = [
	{
		id: "firstName",
		title: "Step #1",
		displayForm: simpleStepForm({
			name: "firstName",
			label: "Entrez votre prénom",
			required: true
		})
	},
	{
		id: "age",
		title: "Step #2",
		displayForm: simpleStepForm({
			name: "age",
			type: "number",
			label: "Entrez votre age",
			required: true
		})
	},
	{
		id: "classe",
		title: "Step #3",
		displayForm: simpleStepForm({
			name: "classe",
			type: "select",
			label: "Choisissez votre classe",
			options: [
				{ code: "magician", label: "Magician" },
				{ code: "warrior", label: "Warrior" },
				{ code: "thief", label: "Thief" }
			]
		})
	}
];

// This default export determines where your story goes in the story list
export default {
	title: "Wizard"
};

/**
 * Display the wizard with an empty initial data object
 */
export const EmptySteps = () => (
	<Box width="600px" height="400px">
		<Wizard id="3-steps-wizard" steps={steps} data={empty_data} currentSlide={0} />
	</Box>
);

/**
 * Display the wizard with a non empty initial data object
 */
export const ModifySteps = () => (
	<Wizard
		id="populated-3-steps-wizard"
		steps={steps}
		data={existing_data}
		currentSlide={0}
	/>
);
