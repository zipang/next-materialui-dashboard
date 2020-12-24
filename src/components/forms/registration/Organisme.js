import StepForm from "@components/forms/StepForm";
import Input from "@forms/Input";

/**
 * A block of fields for the mosttop level Organisme infos
 * (step 2 of the registration process)
 * @param {StateMachime} stateMachine the registration wizard state machine
 */
export const OrganismeForm = ({ state, actions }) => {
	const nextStep = (formData) => {
		return actions.merge(state, { data: { organisme: formData } }, actions.next());
	};
	return (
		<StepForm id="organisme" data={state.data.organisme} onSubmit={nextStep}>
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
		</StepForm>
	);
};

export default {
	form: OrganismeForm
};
