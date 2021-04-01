import { delay } from "@lib/utils/Promises.js";
import ApiError from "@lib/ApiError.js";
import APIClient from "./ApiClient.js";

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

	return Promise.race([APIClient.get(apiEntryPoint), delay(timeout, "timeout")]);
};
