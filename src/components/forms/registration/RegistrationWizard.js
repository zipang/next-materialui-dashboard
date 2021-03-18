import { useAuthentication } from "@components/AuthenticationProvider";
import Wizard from "@forms/wizard/Wizard";
import AdherentsApiClient from "@lib/client/AdherentsApiClient";
import { useEffect, useState } from "react";
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
 */
const restorePreviousState = async (loggedUser) => {
	try {
		const siret = window.localStorage.getItem("siret-search");
		if (siret) {
			const { adherent } = await AdherentsApiClient.retrieveBySiret(siret);
			if (adherent && adherent.owner === loggedUser.username) {
				console.log(
					`Restoring previous registration state from localStorage: ${adherent.nom} (${adherent.statut})`
				);
				return { data: adherent, initialStep: adherent.statut };
			}
		}
	} catch (err) {
		console.error(err);
		window.localStorage.removeItem("siret-search");
	}
	// Nothing retrieved
	return {};
};

/**
 * Remove the Siret Search step when we are restoring the wizard to a pre-filled step
 */
const filterSteps = (steps, { initialStep }) =>
	initialStep ? steps.filter((s) => s.id !== "step-siret-search") : steps;

const RegistrationWizard = () => {
	const { loggedUser } = useAuthentication();
	const [props, setProps] = useState();

	useEffect(async () => {
		const restoredProps = await restorePreviousState(loggedUser);
		if (restoredProps.initialStep) {
			console.log(`Restored wizard state`, restoredProps);
		}
		setProps(restoredProps);
	}, [false]);

	return props ? (
		<Wizard id="registration-wizard" {...props} steps={filterSteps(steps, props)} />
	) : null;
};

export default RegistrationWizard;
