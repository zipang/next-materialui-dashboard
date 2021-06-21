import { delay } from "@lib/utils/Promises.js";
import ApiError from "@lib/ApiError.js";
import APIClient from "./ApiClient.js";
import { getProperty } from "@lib/utils/NestedObjects.js";

export const transformData = (siretData) => {
	let adherent = {};

	if (typeof siretData?.etablissement === "object") {
		const { etablissement } = siretData;

		adherent = {
			siret: getProperty(etablissement, "siret"),
			nom: getProperty(
				etablissement,
				"denomination_usuelle",
				getProperty(
					etablissement,
					"unite_legale.denomination",
					getProperty(etablissement, "unite_legale.nom")
				)
			),
			federation_reseau_enseigne: getProperty(etablissement, "enseigne_1"),
			date_creation: getProperty(etablissement, "date_debut"),
			adresse: {
				rue1: getProperty(etablissement, "geo_l4"),
				rue2: getProperty(etablissement, "complement_adresse"),
				code_postal: getProperty(etablissement, "code_postal"),
				commune: getProperty(etablissement, "libelle_commune")
			}
		};
		const etatAdministratif = getProperty(
			etablissement,
			"unite_legale.etat_administratif"
		);
		const numeroAssociation = getProperty(
			etablissement,
			"unite_legale.identifiant_association"
		);

		if (adherent.federation_reseau_enseigne === "CCAS") {
			adherent.forme_juridique = "ccas-cias";
		} else if (numeroAssociation || etatAdministratif === "A") {
			adherent.forme_juridique = "association";
		} else {
			adherent.forme_juridique = "entreprise";
		}
	}
	console.log(`Siret search found :`, adherent);
	return adherent;
};

/**
 * Call the French Governemnt API about declared business
 * @see https://entreprise.data.gouv.fr/api_doc/sirene
 * @param {String} siret 14 chiffres
 */
export const searchOrganismeBySiret = async (siret, timeout = 2000) => {
	if (!siret || siret.length !== 14 || !Number.parseInt(siret)) {
		throw new ApiError(
			400,
			`Format de no Siret incorrect. Saisissez 14 chiffres. (${siret})`
		);
	}

	const apiEntryPoint = `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${siret}`;

	return Promise.race([
		APIClient.get(apiEntryPoint).then(transformData),
		delay(timeout, "timeout")
	]);
};
