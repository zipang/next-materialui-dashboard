import { useAuthentication } from "@components/AuthenticationProvider";
import Wizard from "@forms/wizard/Wizard";
import {
	welcomeStepsNewAccount,
	siretSearch,
	formSteps,
	stepDemandeContact,
	stepAdhesionPaymentChoice
} from "./RegistrationSteps";

const steps = [
	...welcomeStepsNewAccount,
	...siretSearch,
	...formSteps,
	...stepDemandeContact,
	...stepAdhesionPaymentChoice
];

/**
 * Look if we have an incomplete registration process in the local storage
 * Or create
 */
const initRegistration = (loggedUser) => {
	const savedState = window.localStorage.getItem("registration-wizard");
	if (savedState) {
		try {
			console.log(
				`Retrieved previously saved state of the regsitration wizard`,
				savedState
			);
			return JSON.parse(savedState);
		} catch (err) {
			window.localStorage.removeItem("registration-wizard");
		}
		console.log(
			`Restoring saved state from localStorage: ${JSON.stringify(initialState)} `
		);
	}
};

const RegistrationWizard = () => {
	const loggedUser = useAuthentication();
	const data = initRegistration(loggedUser);
	return <Wizard id="registration-wizard" data={data} steps={steps} />;
};

export default RegistrationWizard;
