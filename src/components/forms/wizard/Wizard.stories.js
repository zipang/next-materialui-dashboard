// Wizard.stories.js
import Wizard from "./Wizard";
import StepForm from "./StepForm";
import Input from "../inputs/Input";
import { Box } from "@material-ui/core";
import AuthenticationProvider from "@components/AuthenticationProvider";
import testUser from "@models/test-user";

const _CLASSES = {
	magician: "Magicien(ne)",
	warrior: "Guerrier(e)",
	thief: "Voleur(se)"
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
			<Input type={type} autoFocus={true} name={name} {...more} />
		</StepForm>
	);
};

// Create some dummy steps to display
const steps = [
	{
		id: "Intro",
		title: "Créez votre personnage",
		help: {
			description: `Dans les étapes suivantes, vous allez renseigner votre personnage de jeu de rôle.
Appuyez sur ENTREE ou cliquez sur 'Etape suivante' à chaque fois que vous voulez valider une étape.`,
			backgroundImage:
				"https://images.unsplash.com/photo-1499989545599-0800ab969152?auto=format&fit=crop&w=800&q=80"
		}
	},
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
		title: "Quel age avez vous ?",
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
					{ name: "country", size: 1 / 3, label: "Pays" }
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
		displayForm: ({
			firstName,
			lastName,
			age,
			classe,
			hometown,
			country,
			abilities
		}) => (
			<Box width="100%">
				<p>{`Bienvenue ${firstName} ${lastName}.
Vous avez ${age} ans et vous êtes un(e) ${_CLASSES[classe]}.
Vous êtes né(e) à ${hometown} (${country}) et 
vos capacités exceptionnelles sont : ${abilities
					.map((c) => _CAPACITIES[c])
					.join(", ")}`}</p>
			</Box>
		),
		validate: (data) => console.log
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
	<AuthenticationProvider user={testUser}>
		<Box width="75vw" height="60vh" minHeight="500px">
			<Wizard
				id="4-steps-wizard"
				steps={steps}
				data={empty_data}
				currentSlide={0}
			/>
		</Box>
	</AuthenticationProvider>
);

/**
 * Display the wizard with a non empty initial data object
 */
export const PrefilledSteps = () => (
	<AuthenticationProvider user={testUser}>
		<Box width="600px" height="400px">
			<Wizard
				id="populated-4-steps-wizard"
				steps={steps}
				data={existing_data}
				currentSlide={0}
			/>
		</Box>
	</AuthenticationProvider>
);
