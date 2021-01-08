// Wizard.stories.js
import Wizard from "./Wizard";
import Input from "./Input";
import StepForm from "./StepForm";
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
 * @return {Function<data,onSubmit>}
 */
const displaySimpleStepForm = ({ name, type = "text", ...more }) => (data, onSubmit) => {
	return (
		<StepForm formId={name} data={data} onSubmit={onSubmit} rerender={new Date()}>
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
		title: "Entrez votre prénom",
		displayForm: displaySimpleStepForm({
			name: "firstName",
			label: "Prénom",
			required: true
		})
	},
	{
		id: "lastName",
		title: "Entrez votre nom",
		displayForm: displaySimpleStepForm({
			name: "lastName",
			label: "Nom",
			required: true
		})
	},
	{
		id: "age",
		title: "Entrez votre age",
		displayForm: displaySimpleStepForm({
			name: "age",
			type: "number",
			label: "Age",
			required: true
		})
	},
	{
		id: "classe",
		title: "Choisissez votre classe",
		displayForm: displaySimpleStepForm({
			name: "classe",
			type: "select",
			label: "Classe",
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
	title: "Wizard",
	component: Wizard
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
export const PrefilledSteps = () => (
	<Box width="600px" height="400px">
		<Wizard
			id="populated-3-steps-wizard"
			steps={steps}
			data={existing_data}
			currentSlide={0}
		/>
	</Box>
);
