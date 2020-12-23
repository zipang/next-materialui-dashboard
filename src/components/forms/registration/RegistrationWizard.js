import SiretSearch from "./SiretSearch";
import Wizard from "@components/Wizard";

/**
 * Build the steps that are aware of the state machine context
 * @param {StateMachine} sm
 * @return {Array<Steps>}
 */
const steps = ({ state, actions }) => [
	{
		title: "Recherche de l'organisme par son no de SIRET",
		actions: {
			onSuccess: (siretData) => {
				actions.merge(state.data, { siretData });
				actions.next();
			}
		},
		form: (data) => <SiretSearch onSuccess={actions.onSuccess} />
	},
	{
		title: "Saisie de l'organisme",
		actions: {
			onSuccess: (siretData) => {
				actions.merge(state.data, { siretData });
				actions.next();
			}
		},
		form: (data) => <SiretSearch onSuccess={actions.onSuccess} />
	}
];

const RegistrationWizard = () => {};
