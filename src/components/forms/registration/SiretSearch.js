import { useState } from "react";
import { applyNumericMask, getDigitsOnly } from "@components/forms/validation/utils.js";
import APIForm from "../APIForm.js";
import Formatted from "../inputs/Formatted.js";
import Submit from "../inputs/Submit.js";
import { useAuthentication } from "@components/AuthenticationProvider.js";
import User from "@models/User.js";

export const formatSiret = applyNumericMask("999 999 999 99999");
export const isSiretValid = (str = "") =>
	(str && str.length === 14) || "Saisissez un no de SIRET valide (14 chiffres)";

export const SiretInput = ({ validation, label = "N° de Siret", ...props }) => (
	<Formatted
		label={label}
		format={formatSiret}
		serialize={getDigitsOnly}
		validation={{ isSiretValid, ...validation }}
		{...props}
	/>
);

/**
 * Siret Search API call was a success
 * Take the format returned by /siret/search API
 * And convert it to our needs
 * @param {Function} callback
 * @param {User} user Currently logged user
 */
export const mergeSiretData = (callback, user) => (
	{ siret, siretData, savedData },
	errors
) => {
	// Remember this one
	window.localStorage.setItem("siret-search", siret);

	if (savedData) {
		const updatedAt = new Date(savedData.updatedAt);
		alert(
			`Nous avons retrouvé votre déclaration en cours 
du ${updatedAt.toLocaleDateString("fr")} (${updatedAt
				.toLocaleTimeString("fr")
				.substr(0, 5)}).`
		);
		return callback(savedData);
	}

	if (siretData === "timeout") {
		// Sometimes the Government API is down..
		alert(`Timeout sur la recherche par Siret. 
Vous allez devoir saisir vos informations manuellement.`);
		return callback({});
	}

	if (typeof siretData === "object") {
		siretData.statut = "en_attente";
		if (user) {
			siretData.representant = {
				prenom: user.firstName,
				nom: user.lastName,
				email: user.email
			};
		}

		console.log(`Siret data extracted :`, siretData);

		callback(siretData);
	} else {
		// Create an error message in the same format that react-hook-form uses
		callback(
			{},
			{
				siret: {
					type: "unknown",
					message: "No de Siret Inconnu"
				}
			}
		);
	}
};

/**
 * A specific SIRET search for that sends sirets number to our internal API
 * which uses the Open Data
 * @param {Function} onSuccess Callback that receives the SIRET search API response data
 */
export const SiretSearchForm = ({ onSubmit }) => {
	const [apiErrorMessage, setApiErrorMessage] = useState(false);
	const { loggedUser } = useAuthentication();

	const onError = (error) => {
		console.log(`Siret search returned error`, error);
		setApiErrorMessage(error.message);
	};

	const displayApiErrorMessage = () => {
		if (apiErrorMessage) {
			const forgetMe = apiErrorMessage;
			setApiErrorMessage(false);
			return forgetMe;
		} else {
			return true;
		}
	};

	return (
		<APIForm
			action="/api/siret/search"
			onSuccess={mergeSiretData(onSubmit, loggedUser)}
			onError={onError}
			customStyles={{ width: "18em" }}
		>
			<SiretInput
				name="siret"
				label="No de Siret"
				helperText={typeof apiErrorMessage === "string" ? apiErrorMessage : ""}
				autoFocus={true}
				validation={{
					displayApiErrorMessage
				}}
			/>
			<Submit label="Rechercher" />
		</APIForm>
	);
};

export default {
	form: SiretSearchForm
};
