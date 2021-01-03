// Wizard.stories.js
import Wizard from "./Wizard";
import Input from "./Input";
import StepForm from "./StepForm";

const empty_data = {};
const existing_data = {
	firstName: "Elric",
	age: 23,
	classe: "magician"
};

const mergeData = (data, payload) => ({
	...data,
	...payload
});

const createSimpleStep = ({ name, label, type = "text", ...more }) => (data) => (
	<StepForm formId={name} data={data}>
		{type === "text" && <Input.Text name={name} {...more} />}
		{type === "select" && <Input.SelectBox name={name} {...more} />}
		{type === "number" && <Input.Integer name={name} {...more} />}
	</StepForm>
);

// Create some dummy steps to display
const steps = [
	{
		title: "Step #1",
		form: createSimpleStep({ name: "firstName", label: "Entrez votre prénom" })
	},
	{
		title: "Step #2",
		form: createSimpleStep({ name: "age", label: "Entrez votre age" })
	},
	{
		title: "Step #3",
		form: createSimpleStep({
			name: "classe",
			label: "Choisissez votre classe",
			options: ["magician", "warrior", "thief"]
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
	<Wizard steps={steps} data={empty_data} currentSlide={0} />
);

/**
 * Display the wizard with a non empty initial data object
 */
export const ModifySteps = () => (
	<Wizard steps={steps} data={existing_data} currentSlide={0} />
);
