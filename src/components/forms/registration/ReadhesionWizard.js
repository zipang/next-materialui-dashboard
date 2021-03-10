import { withStateMachine } from "@components/StateMachine";
import Wizard from "@forms/wizard/Wizard";
import WizardStateMachine from "@forms/wizard/WizardStateMachine";
import {
	welcomeStepsReAdhesion,
	formSteps,
	stepAdhesionPaymentChoice
} from "./RegistrationSteps";

const steps = [...welcomeStepsReAdhesion, ...formSteps, ...stepAdhesionPaymentChoice];

const ReadhesionWizard = ({ data }) =>
	withStateMachine(Wizard, WizardStateMachine("readhesion-wizards", steps, data));

export default ReadhesionWizard;
