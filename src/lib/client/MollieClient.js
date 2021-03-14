import ApiError from "@lib/ApiError";

/**
 * @see https://entreprise.data.gouv.fr/api_doc/sirene
 * @param {String} siret 14 chiffres
 */
export const createPayment = async (data) => {
	const apiEntryPoint = `https://api.mollie.com/v2/payments`;

	if (!process.env.MOLLIE_API_KEY) {
		throw new Error(`Le Token pour l'API Mollie n'a pas été trouvé`);
	}

	const resp = await fetch(apiEntryPoint, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`
		}
	});

	const respBody = await resp.json();

	if (resp.status !== 200) {
		// Error format contains a single message field
		throw new ApiError(resp.status, respBody.message);
	} else {
		return respBody;
	}
};
