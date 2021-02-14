// Registration.stories.js
import CenteredPaperSheet from "@components/CenteredPaperSheet";
import Wizard from "../Wizard";

import { steps } from "./RegistrationWizard";

// This default export determines where your story goes in the story list
export default {
	title: "Registration steps"
};

const OnePageWizard = (stepId) => () => (
	<CenteredPaperSheet>
		<Wizard id="one-page-wizard" steps={steps.filter(({ id }) => id === stepId)} />
	</CenteredPaperSheet>
);

/**
 * Step Sample
 */
export const Intro = OnePageWizard("step-00-intro");

/**
 * Step Sample
 */
export const SiretCreation = OnePageWizard("step-02-siret");

/**
 * Step Sample
 */
export const Contacts = OnePageWizard("step-03-contacts");

/**
 * Step Sample
 */
export const Declarations = OnePageWizard("step-declarations");

/**
 * Step Sample
 */
export const Beneficiaires = OnePageWizard("step-beneficiaires");

/**
 * Step Sample
 */
export const Effectifs = OnePageWizard("step-effectifs");

/**
 * Step Sample
 */
export const RatiosActivite = OnePageWizard("step-activite-ratios");

/**
 * Step Sample
 */
export const Certifications = OnePageWizard("step-05-certifications");

/**
 * Step Sample
 */
export const Syneos = OnePageWizard("step-06-syneos");

/**
 * Step Sample
 */
export const SystemesGestion = OnePageWizard("step-systemes-gestion");

/**
 * Step Sample
 */
export const DemandeContact = OnePageWizard("step-demande-contact");

/**
 * Step Sample
 */
export const LastStep = OnePageWizard("step-registration-recap");
