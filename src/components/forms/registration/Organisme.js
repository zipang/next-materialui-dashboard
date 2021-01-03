import StepForm from "@components/forms/StepForm";
import Input from "@forms/Input";
import { formatSiret, unformatSiret } from "./SiretSearch";

/**
 * A block of fields for the mosttop level Organisme infos
 * (step 2 of the registration process)
 * @param {StateMachime} stateMachine the registration wizard state machine
 */
export const OrganismeForm = ({ data = {}, onSubmit }) => {
	return (
		<StepForm id="organisme" data={data} onSubmit={onSubmit}>
			<Input.Format
				label="No de Siret"
				name="siret"
				readonly
				format={formatSiret}
				serialize={unformatSiret}
				autoFocus={true}
				validation={{ required: "Saisissez un no de SIRET valide (14 chiffres)" }}
			/>
			<Input.Text
				label="Nom"
				name="nom"
				validation={{ required: "Saisissez le nom de l'organisme" }}
			/>
			<Input.Date
				label="Date de création"
				name="date_creation"
				validation={{ required: "Saisissez la date de création de l'organisme" }}
			/>
			<Input.SelectBox
				label="Statut"
				name="statut"
				options={["association", "entreprise", "ccas-cias"]}
				validation={{ required: "Saisissez le statut de l'organisme" }}
			/>
		</StepForm>
	);
};

export default {
	title: "Informations de l'organisme",
	form: (data) => <OrganismeForm dta={data} />
};
