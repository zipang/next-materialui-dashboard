import Input, { applyNumericMask, getDigitsOnly } from "@components/forms/Input";
import { getProperty } from "@lib/utils/NestedObjects";
import { useState } from "react";
import APIForm from "../APIForm";

export const formatSiret = applyNumericMask("999 999 999 99999");

export const SiretInput = ({ ...props }) => (
	<Input.Formatted
		format={formatSiret}
		serialize={getDigitsOnly}
		validation={{ required: "Saisissez un no de SIRET valide (14 chiffres)" }}
		{...props}
	/>
);

/**
 * Take the format returned by /siret/search API
 * And convert it to our needs
 * @param {Function} callback
 */
export const mergeSiretData = (callback) => (siretData, errors) => {
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
			date_creation: getProperty(etablissement, "date_creation"),
			adresse: {
				rue1: getProperty(etablissement, "geo_l4"),
				rue2: getProperty(etablissement, "complement_adresse"),
				code_postal: getProperty(etablissement, "code_postal"),
				commune: getProperty(etablissement, "libelle_commune")
			},
			representant: {
				nom: getProperty(etablissement, "unite_legale.nom"),
				prenom: getProperty(etablissement, "unite_legale.prenom_1")
			}
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
			merged.statut = "ccas-cias";
		} else if (numeroAssociation) {
			merged.statut = "association";
		} else {
			merged.statut = "entreprise";
		}

		console.log(`We extracted some data`, merged);
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

const onError = (inputRef) => (errors) => {};

/**
 * A specific SIRET search for that sends sirets number to our internal API
 * which uses the Open Data
 * @param {Function} onSuccess Callback that receives the SIRET search API response data
 */
export const SiretSearchForm = ({ onSubmit }) => {
	const [apiErrorMessage, setApiErrorMessage] = useState(true);

	const onError = (error) => {
		console.log(`Siret search returned error`, error);
		setApiErrorMessage(error.message);
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
					required: "Saisissez un no de SIRET valide (14 chiffres)",
					validate: () => apiErrorMessage
				}}
			/>
			<Input.Submit label="Rechercher" />
		</APIForm>
	);
};

export default {
	form: SiretSearchForm
};
