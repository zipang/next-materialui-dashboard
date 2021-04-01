import { withStateMachine } from "@components/StateMachine.js";
import Wizard from "@forms/wizard/Wizard.js";
import WizardStateMachine from "@forms/wizard/WizardStateMachine.js";
import {
	welcomeStepsReAdhesion,
	formSteps,
	stepAdhesionPaymentChoice
} from "./RegistrationSteps.js";

const steps = [...welcomeStepsReAdhesion, ...formSteps, ...stepAdhesionPaymentChoice];

const ReadhesionWizard = ({ data }) =>
	withStateMachine(Wizard, WizardStateMachine("readhesion-wizards", steps, data));

export default ReadhesionWizard;
