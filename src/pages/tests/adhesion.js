import CenteredPaperSheet from "@components/CenteredPaperSheet";
import useFormStyles from "@components/forms/useFormStyles";
import { sendMailTemplate } from "@lib/client/MailApiClient";
import APIForm from "@components/forms/APIForm";
import { SiretInput } from "@components/forms/registration/SiretSearch";
import Text from "@components/forms/inputs/Text";
import Email from "@components/forms/inputs/Email";
import Submit from "@components/forms/inputs/Submit";
import { merge } from "@lib/utils/deepMerge.js";
import {
	register,
	createAdhesion,
	confirmAdhesion
} from "@lib/client/AdherentsApiClient.js";
import testAdherent from "../../models/adherent-test.js";
import { Button } from "@material-ui/core";
import { useState } from "react";

const TestEmailTemplatePage = () => {
	const [adherent, setAdherent] = useState(null);
	const [adhesion, setAdhesion] = useState(null);

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
			const data = merge({}, testAdherent, formData);
			data.effectifs.total = Math.round(Math.random() * 15);
			data.statut = "en _attente";
			setAdherent(data);
			const resp = await register(null, data);
			if (resp.success) {
				await sendMailTemplate("welcome", formData);
			}
			alert(JSON.stringify(resp, null, "\t"));
		} catch (err) {
			alert(err.message);
		}
	};

	/**
	 *
	 */
	const sendAdhesionRequest = async () => {
		try {
			if (!adherent) {
				alert(`Start by creating a new adherent`);
				return;
			}
			const { adhesion } = await createAdhesion(adherent.siret, {
				mode_paiement: "cheque"
			});
			setAdhesion(adhesion);
			alert(`Received new adhesion number : ${adhesion.no}`);
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	/**
	 * Confirm an adhesion when payment has been received
	 */
	const sendPaymentConfirmation = async () => {
		try {
			const resp = await confirmAdhesion(adhesion.no);
			alert(`Adhesion ${adhesion.no} has been confirmed : 
${JSON.stringify(resp.adhesion, null, "\t")}`);
			setAdhesion(resp.adhesion);
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	return (
		<CenteredPaperSheet xs={10} md={8}>
			<APIForm className={styles.form} onSubmit={sendMessageTemplate}>
				<h1>Send a welcome email to</h1>
				<SiretInput name="siret" autoFocus={true} />
				<Text
					name="nom"
					label="Nom structure"
					required="Saissiez un nom d'Adherent"
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
				<Text
					name="adresse.commune"
					label="Ville"
					required="Saisissez la commune"
				/>
				<Email
					name="representant.email"
					label="Email"
					required="Saisissez l'email' du représentant"
				/>
				<Submit label="Send" />
				<Button
					color="primary"
					fullWidth={true}
					disabled={!adherent}
					onClick={sendAdhesionRequest}
				>
					Adhesion
				</Button>
				<Button
					color="primary"
					fullWidth={true}
					disabled={!adhesion}
					onClick={sendPaymentConfirmation}
				>
					Paiement
				</Button>
			</APIForm>
		</CenteredPaperSheet>
	);
};
export default TestEmailTemplatePage;
