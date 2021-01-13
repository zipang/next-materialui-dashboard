// Wizard.stories.js
import Wizard from "./Wizard";
import Input from "./Input";
import StepForm from "./StepForm";
import { Box } from "@material-ui/core";

const classes = {
	magician: "Magicien",
	warrior: "Guerrier",
	thief: "Voleur"
};
const classesOptions = Object.keys(classes).reduce((prev, key) => {
	prev.push({ code: key, label: classes[key] });
	return prev;
}, []);

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
			name: "cls",
			type: "select",
			label: "Classe",
			options: classesOptions
		})
	},
	{
		id: "resume",
		title: "Prêt à jouer",
		displayForm: ({ firstName, lastName, age, cls }) => (
			<Box width="100%">
				<p>{`Bienvenue ${firstName} ${lastName}.
Vous avez ${age} ans et vous êtes un(e) ${classes[cls]}`}</p>
			</Box>
		)
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
		<Wizard id="4-steps-wizard" steps={steps} data={empty_data} currentSlide={0} />
	</Box>
);

/**
 * Display the wizard with a non empty initial data object
 */
export const PrefilledSteps = () => (
	<Box width="600px" height="400px">
		<Wizard
			id="populated-4-steps-wizard"
			steps={steps}
			data={existing_data}
			currentSlide={0}
		/>
	</Box>
);
