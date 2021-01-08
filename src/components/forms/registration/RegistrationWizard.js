import { SiretSearchForm } from "./SiretSearch";
import { OrganismeForm } from "./Organisme";
import Wizard from "@forms/Wizard";

const steps = [
	{
		id: "step-01-siret-search",
		title: "Recherche de l'organisme par son no de SIRET",
		displayForm: (data) => <SiretSearchForm onSuccess={mergeSiretData} />
	},
	{
		id: "step-02-organisme-name",
		title: "Saisie de l'organisme",
		displayForm: (data, onSubmit) => <OrganismeForm data={data} onSubmit={onSubmit} />
	}
];

const RegistrationWizard = () => {
	return <Wizard id="registration-wizard" steps={steps} />;
};

export default RegistrationWizard;
