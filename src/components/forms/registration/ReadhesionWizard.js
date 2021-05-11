import Wizard from "@forms/wizard/Wizard.js";
import AdherentsApiClient from "@lib/client/AdherentsApiClient.js";
import { useEffect } from "react";
import {
	welcomeStepsReAdhesion,
	formSteps,
	stepAdhesionPaymentChoice
} from "./RegistrationSteps.js";

const steps = [...welcomeStepsReAdhesion, ...formSteps, ...stepAdhesionPaymentChoice];

const ReadhesionWizard = ({ data }) => (
	<Wizard id="re-adhesion" data={data} steps={steps} initialStep={data.statut} />
);

export default ReadhesionWizard;
