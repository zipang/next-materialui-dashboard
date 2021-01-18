// Wizard.stories.js
import Wizard from "./Wizard";
import Input from "./Input";
import StepForm from "./StepForm";
import { Box, Grid } from "@material-ui/core";

const _CLASSES = {
	magician: "Magicien",
	warrior: "Guerrier",
	thief: "Voleur"
};
const _CAPACITIES = {
	flight: "Vol",
	strength: "Super force",
	magic: "Boules de Feu",
	"laser-eyes": "Yeux lasers",
	bodyless: "Traverser les murs",
	invisible: "Invisibilité"
};

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
			<Grid container>
				<Grid item>
					<Input type={type} autoFocus={true} name={name} {...more} />
				</Grid>
			</Grid>
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
		title: "Entrez votre nom",
		displayForm: displaySimpleStepForm({
			name: "age",
			label: "Age",
			type: "number",
			required: true
		})
	},
	{
		id: "origine",
		title: "Entrez votre ville de naissance",
		fields: [
			{
				type: "group",
				label: "Origine",
				fields: [
					{ name: "hometown", size: 2 / 3, label: "Né à", required: true },
					{
						name: "age",
						size: 1 / 3,
						label: "Age",
						type: "number",
						required: true
					}
				]
			}
		]
	},
	{
		id: "classe",
		title: "Choisissez votre classe",
		displayForm: displaySimpleStepForm({
			name: "classe",
			type: "select",
			label: "Classe",
			options: _CLASSES
		})
	},
	{
		id: "abilities",
		title: "Indiquez vos capacités",
		displayForm: displaySimpleStepForm({
			name: "abilities",
			label: "Capacités",
			type: "checkboxes",
			options: _CAPACITIES
		})
	},

	{
		id: "resume",
		title: "Prêt à jouer",
		displayForm: ({ firstName, lastName, age, classe, abilities }) => (
			<Box width="100%">
				<p>{`Bienvenue ${firstName} ${lastName}.
Vous avez ${age} ans et vous êtes un(e) ${_CLASSES[classe]}
Vos capacités exceptionnelles sont : ${abilities
					.map((c) => _CAPACITIES[c])
					.join(", ")}`}</p>
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
