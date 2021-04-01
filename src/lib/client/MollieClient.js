import ApiError from "@lib/ApiError.js";

const apiEntryPoint = `https://api.mollie.com/v2/payments`;

/**
 * @see https://entreprise.data.gouv.fr/api_doc/sirene
 * @param {Object} data
 * @param {Number} data.montant
 * @param {String} data.description
 */
export const createPayment = async (data) => {
	const { amount } = data;
	if (!amount || !amount.value || !Number.parseInt(amount.value)) {
		throw new ApiError(400, `Indiquez le montant du paiement.`);
	}
	if (!data.description) {
		throw new ApiError(400, `Indiquez la description du paiement.`);
	}

	if (!process.env.MOLLIE_API_KEY) {
		throw new Error(`Le Token pour l'API Mollie n'a pas été trouvé`);
	}

	const body = JSON.stringify(data);
	console.log(`Sending Mollie request for mayment creation`, data);

	const resp = await fetch(apiEntryPoint, {
		method: "POST",
		body,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`
		}
	});

	const respBody = await resp.json();
	console.log(`Mollie payment response. Status ${resp.status}`, respBody);

	if (resp.status !== 201) {
		// CREATED
		// Error format contains a single message field
		throw new ApiError(resp.status, respBody.detail);
	} else {
		return respBody;
	}
};
