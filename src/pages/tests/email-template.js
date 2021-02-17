import CenteredPaperSheet from "@components/CenteredPaperSheet";
import useFormStyles from "@components/forms/useFormStyles";
import { sendMailTemplate } from "@lib/client/MailApiClient";
import APIForm from "@components/forms/APIForm";
import { SiretInput } from "@components/forms/registration/SiretSearch";
import Text from "@components/forms/inputs/Text";
import Email from "@components/forms/inputs/Email";
import Submit from "@components/forms/inputs/Submit";
import { merge } from "@lib/utils/deepMerge.js";
import { register } from "@lib/client/RegistrationApiClient.js";
import testOrganisme from "../../models/organisme-test.js";
import { withAuthentication } from "@components/AuthenticationProvider.js";

const TestEmailTemplatePage = () => {
	const styles = useFormStyles({
		minWidth: "1024px",
		"& label": {
			display: "block",
			width: "80%"
		}
	});

	/**
	 *
	 * @param {DOMEvent} evt
	 */
	const sendMessageTemplate = async (formData) => {
		try {
			const orgData = merge({}, testOrganisme, formData);
			const resp = await register(null, orgData);
			// const resp = await sendMailTemplate("welcome", formData);
			alert(JSON.stringify(resp, null, "\t"));
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<APIForm className={styles.form} onSubmit={sendMessageTemplate}>
				<h1>Send a welcome email to</h1>
				<SiretInput name="siret" />
				<Text
					name="nom"
					label="Nom structure"
					required="Saissiez un nom d'Organisme"
				/>
				<Text
					name="representant.prenom"
					label="Prénom"
					required="Saisissez le prénom du représentant"
				/>
				<Text
					name="representant.nom"
					label="Nom"
					required="Saisissez le nom du représentant"
				/>
				<Email
					name="representant.email"
					label="Email"
					required="Saisissez l'email' du représentant"
				/>
				<Submit label="Send" />
			</APIForm>
		</CenteredPaperSheet>
	);
};
export default withAuthentication(TestEmailTemplatePage);
