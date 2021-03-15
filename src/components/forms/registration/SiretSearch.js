import { useState } from "react";
import { getProperty } from "@lib/utils/NestedObjects";
import { applyNumericMask, getDigitsOnly } from "@components/forms/validation/utils";
import APIForm from "../APIForm";
import Formatted from "../inputs/Formatted";
import Submit from "../inputs/Submit";

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
 */
export const mergeSiretData = (callback) => ({ siret, siretData, savedData }, errors) => {
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

	if (typeof siretData?.etablissement === "object") {
		const { etablissement } = siretData;

		const merged = {
			siret: getProperty(etablissement, "siret"),
			nom: getProperty(
				etablissement,
				"denomination_usuelle",
				getProperty(etablissement, "unite_legale.denomination")
			),
			federation_reseau_enseigne: getProperty(etablissement, "enseigne_1"),
			date_creation: getProperty(etablissement, "date_debut"),
			adresse: {
				rue1: getProperty(etablissement, "geo_l4"),
				rue2: getProperty(etablissement, "complement_adresse"),
				code_postal: getProperty(etablissement, "code_postal"),
				commune: getProperty(etablissement, "libelle_commune")
			},
			representant: {
				nom: getProperty(etablissement, "unite_legale.nom"),
				prenom: getProperty(etablissement, "unite_legale.prenom_1")
			},
			effectifs: {
				total: Number(getProperty(etablissement, "tranche_effectifs", 0))
			},
			statut: "en_attente"
		};
		const sex = getProperty(etablissement, "unite_legale.sexe");
		if (sex) {
			merged.representant.civilite = sex === "M" ? "M." : "Mme";
		}
		const etatAdministratif = getProperty(
			etablissement,
			"unite_legale.etat_administratif"
		);
		const numeroAssociation = getProperty(
			etablissement,
			"unite_legale.identifiant_association"
		);

		if (merged.federation_reseau_enseigne === "CCAS") {
			merged.forme_juridique = "ccas-cias";
		} else if (numeroAssociation || etatAdministratif === "A") {
			merged.forme_juridique = "association";
		} else {
			merged.forme_juridique = "entreprise";
		}

		console.log(`Siret data extracted :`, merged);

		callback(merged);
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
			onSuccess={mergeSiretData(onSubmit)}
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
