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

export const Intro = OnePageWizard("step-intro");

export const DocumentsNeccessaires = OnePageWizard("step-documents-necessaires");

export const SiretCreation = OnePageWizard("step-02-siret");

export const Contacts = OnePageWizard("step-03-contacts");

export const Declarations = OnePageWizard("step-declarations");

export const Beneficiaires = OnePageWizard("step-beneficiaires");

export const Effectifs = OnePageWizard("step-effectifs");

export const Synthese = OnePageWizard("step-synthese");

export const RatiosActivite = OnePageWizard("step-activite-ratios");

export const Certifications = OnePageWizard("step-05-certifications");

export const Syneos = OnePageWizard("step-06-syneos");

export const SystemesGestion = OnePageWizard("step-systemes-gestion");

export const DemandeContact = OnePageWizard("step-demande-contact");

export const LastStep = OnePageWizard("step-registration-recap");
