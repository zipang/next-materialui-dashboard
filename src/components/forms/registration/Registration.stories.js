// Registration.stories.js
import CenteredPaperSheet from "@components/CenteredPaperSheet";
import Wizard from "../Wizard";

import { steps } from "./RegistrationWizard";

// This default export determines where your story goes in the story list
export default {
	title: "Registration steps"
};

/**
 * Step Sample
 */
export const SiretCreation = (args) => (
	<CenteredPaperSheet fullHeight={true}>
		<Wizard steps={steps.filter(({ id }) => id === "step-02-siret")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Contacts = (args) => (
	<CenteredPaperSheet fullHeight={true}>
		<Wizard steps={steps.filter(({ id }) => id === "step-03-contacts")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Declarations = (args) => (
	<CenteredPaperSheet fullHeight={true}>
		<Wizard steps={steps.filter(({ id }) => id === "step-04-declarations")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const ActiviteBeneficiaires = (args) => (
	<CenteredPaperSheet fullHeight={true}>
		<Wizard steps={steps.filter(({ id }) => id === "step-activite-beneficiaires")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Certifications = (args) => (
	<CenteredPaperSheet fullHeight={true}>
		<Wizard steps={steps.filter(({ id }) => id === "step-05-certifications")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Syneos = (args) => (
	<CenteredPaperSheet fullHeight={true}>
		<Wizard steps={steps.filter(({ id }) => id === "step-06-syneos")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Effectifs = (args) => (
	<CenteredPaperSheet fullHeight={true}>
		<Wizard steps={steps.filter(({ id }) => id === "step-effectifs")} />
	</CenteredPaperSheet>
);
