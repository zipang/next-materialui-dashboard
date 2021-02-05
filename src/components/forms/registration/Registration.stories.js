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
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-02-siret")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Contacts = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-03-contacts")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Declarations = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-04-declarations")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Beneficiaires = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-beneficiaires")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Effectifs = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-effectifs")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const RatiosActivite = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-activite-ratios")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Certifications = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-05-certifications")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Syneos = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-06-syneos")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const SystemesGestion = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-systemes-gestion")} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const LastStep = (args) => (
	<CenteredPaperSheet>
		<Wizard steps={steps.filter(({ id }) => id === "step-registration-recap")} />
	</CenteredPaperSheet>
);
