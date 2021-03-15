import { useAuthentication } from "@components/AuthenticationProvider";
import Wizard from "@forms/wizard/Wizard";
import AdherentsApiClient from "@lib/client/AdherentsApiClient";
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
const restoreState = (loggedUser) => {
	try {
		const siret = window.localStorage.getItem("siret-search");
		const { adherent } = AdherentsApiClient.retrieveBySiret(siret);
		if (adherent && adherent.owner === loggedUser.username) {
			console.log(
				`Restoring previous registration state from localStorage: ${adherent.nom} (${adherent.statut})`
			);
			return { data: adherent };
		}
	} catch (err) {
		window.localStorage.removeItem("siret-search");
	}
};

const RegistrationWizard = () => {
	const loggedUser = useAuthentication();
	const data = restoreState(loggedUser);
	return <Wizard id="registration-wizard" data={data} steps={steps} />;
};

export default RegistrationWizard;
