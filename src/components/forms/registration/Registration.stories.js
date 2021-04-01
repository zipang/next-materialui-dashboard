// Registration.stories.js
import AuthenticationProvider from "@components/AuthenticationProvider.js";
import CenteredPaperSheet from "@components/CenteredPaperSheet.js";
import testUser from "@models/test-user.js";
import Wizard from "../wizard/Wizard.js";
import { formSteps } from "./RegistrationSteps.js";

// This default export determines where your story goes in the story list
export default {
	title: "Registration steps"
};

const OnePageWizard = (stepId) => (
	<AuthenticationProvider user={testUser}>
		<CenteredPaperSheet>
			<Wizard
				id="one-page-wizard"
				steps={formSteps.filter(({ id }) => id === stepId)}
			/>
		</CenteredPaperSheet>
	</AuthenticationProvider>
);

export const Intro = OnePageWizard("step-intro");

export const DocumentsNeccessaires = OnePageWizard("step-documents-necessaires");

export const SiretCreation = OnePageWizard("step-organisme-essentials");

export const Contacts = OnePageWizard("step-contacts");

export const Declarations = OnePageWizard("step-declarations");

export const Beneficiaires = OnePageWizard("step-beneficiaires");

export const Effectifs = OnePageWizard("step-effectifs");

export const Synthese = OnePageWizard("step-synthese");

export const RatiosActivite = OnePageWizard("step-activite-ratios");

export const Certifications = OnePageWizard("step-certifications");

export const Syneos = OnePageWizard("step-syneos");

export const SystemesGestion = OnePageWizard("step-systemes-gestion");

export const DemandeContact = OnePageWizard("step-demande-contact");

export const LastStep = OnePageWizard("step-registration-choice");
