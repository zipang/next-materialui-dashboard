import Input from "@components/forms/Input";
import { getProperty } from "@lib/utils/NestedObjects";
import { useState } from "react";
import APIForm from "../APIForm";

/**
 * Unformat the display format (takes only the digits and remove the spaces)
 * @param {String} str displayed format
 * @return {String}
 */
export const unformatSiret = (str = "") => str.replace(/[^\d]+/gi, "");

/**
 * Display SIRET code with spaces between blocks
 * 999 999 999 99999
 * @param {String} str current input value
 * @return {String}
 */
export const formatSiret = (str = "") => {
	const chars = unformatSiret(str).split("");
	return chars.reduce(
		(prev, cur, index) =>
			(index === 3 || index === 6 || index === 9
				? `${prev} ${cur}` // add a space between blocks
				: `${prev}${cur}`
			).substr(0, 17), // limit to 17 chars (14 + 3 spaces)
		""
	);
};

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
		if (etatAdministratif === "A") {
			merged.statut = "association";
		} else if (etatAdministratif === "F") {
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
	const [apiError, setApiError] = useState(false);
	return (
		<APIForm
			action="/api/siret/search"
			onSuccess={mergeSiretData(onSubmit)}
			onError={setApiError}
		>
			<Input.Formatted
				label="No de Siret"
				name="siret"
				format={formatSiret}
				serialize={unformatSiret}
				autoFocus={true}
				validation={{
					required: "Saisissez un no de SIRET valide (14 chiffres)",
					unknown: () => apiError
				}}
			/>
			<Input.Submit label="Rechercher" />
		</APIForm>
	);
};

export default {
	form: SiretSearchForm
};
