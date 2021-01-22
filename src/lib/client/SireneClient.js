import { ApiError } from "next/dist/next-server/server/api-utils";

/**
 * @see https://entreprise.data.gouv.fr/api_doc/sirene
 * @param {String} siret 14 chiffres
 */
export const getOrganismeBySiret = async (siret) => {
	if (!siret || siret.length !== 14 || !Number.parseInt(siret)) {
		throw new Error(
			`Format de no Siret incorrect. Saisissez 14 chiffres. (${siret})`
		);
	}

	const apiEntryPoint = `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${siret}`;

	// if (!process.env.SIRENE_API_TOKEN) {
	// 	throw new Error(`Le Token pour l'API Sirene n'a pas été trouvé`);
	// }

	const resp = await fetch(apiEntryPoint, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
			// "Authorization : Bearer": process.env.SIRENE_API_TOKEN
		}
	});

	const respBody = await resp.json();

	if (resp.status !== 200) {
		// Error format contains a single message field
		throw new ApiError(
			resp.status,
			resp.status === 404 ? "No de Siret inconnu" : respBody.message
		);
	} else {
		return respBody;
	}
};
