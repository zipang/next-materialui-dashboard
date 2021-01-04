import { SiretSearchForm } from "./SiretSearch";
import { OrganismeForm } from "./Organisme";
import Wizard from "@forms/Wizard";
import { useEventBus } from "@components/EventBusProvider";
import { useStateMachine } from "@components/StateMachine";

/**
 * Build the steps that are aware of the state machine context
 * @param {StateMachine} sm
 * @return {Array<Steps>}
 */
const createSteps = ({ state, actions }) => {
	const mergeSiretData = (siretData) => {};

	// Send the event to validate the data of this step
	const validateStep = (step) => () => {
		const eb = useEventBus();
		eb.emit(`${step}:validate`);
	};
	const mergeStepData = (stepData) => {};

	return [
		{
			title: "Recherche de l'organisme par son no de SIRET",
			form: (data) => <SiretSearchForm onSuccess={mergeSiretData} />
		},
		{
			title: "Saisie de l'organisme",
			form: (data) => <OrganismeForm data={data} />
		}
	];
};

const RegistrationWizard = () => {
	const sm = useStateMachine({ id: "registration-wizard" });
	const steps = createSteps();

	return <Wizard steps={steps} />;
};