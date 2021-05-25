import APIClient from "./ApiClient.js";
import ApiError from "@lib/ApiError.js";

/**
 * Let a user update some informations about an existing adherent
 * @param {Object} user The logged user
 * @param {Object} data Data to update on the adherent
 */
export const update = async (user, data) => {
	try {
		if (user && !user.isAdmin()) {
			// Because admins can edit but not take ownership
			data.owner = user.username;
		}
		if (data.demande_contact_adherent === "true") {
			// We have a strange problem here as the field is not serialized correctly as a Boolean
			data.demande_contact_adherent = true;
		}
		const { success, adherent } = await APIClient.post(
			`/api/adherent/${data.siret}`,
			data
		);
		return adherent;
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

/**
 * Create a new pending adhesion request for this adherent
 */
export const createAdhesion = async (user, siret, data = {}) => {
	try {
		if (user && !user.isAdmin()) {
			// Because admins can edit(?) but not take ownership
			data.owner = user.username;
		}
		return await APIClient.post(`/api/adherent/${siret}/adhesion`, data);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

/**
 * Confirm the payment of a pending adhesion for this adherent
 */
export const confirmAdhesion = async (no, data = {}) => {
	return await APIClient.post(`/api/adhesion/${no}/confirm-payment`, data);
};

/**
 * Retrieve a list of Adherents following some criterias
 * (Filter by example)
 * @example
 *   const { rows } = await Parse.Adherent.retrieve({ nom: "*SARL" })
 *
 * @param {Object} params as key-value pairs
 * @param {Array<String>} fields List of fields
 */
export const retrieve = async (params = {}, fields) => {
	try {
		console.log(`Retrieve adherents...`);
		return await APIClient.get(`/api/adherent`, params);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

/**
 * Retrieve a single adherent by its Siret number
 * @example
 *   const adh = await Parse.Adherent.retrieveBySiret("1234567891234")
 *
 * @param {String} siret
 * @param {Object} [params] Optional params like the fields to extract
 */
export const retrieveBySiret = async (siret, params = {}) => {
	if (!siret) return;
	const { success, adherent } = await APIClient.get(`/api/adherent/${siret}`, params);
	return adherent;
};

/**
 * Retrieve a list of adhesions following some criterias
 * (Filter by example)
 * @example
 *   const { rows } = await Parse.Adherent.retrieveAdhesions({ nom: "*SARL" })
 *
 * @param {Object} params as key-value pairs
 */
export const retrieveAdhesions = async (params = {}) => {
	try {
		const resp = await APIClient.get(`/api/adhesion`, params);
		console.log("retrieveAdhesions()", resp);
		return resp;
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

const AdherentsApiClient = {
	retrieve,
	retrieveBySiret,
	update,
	createAdhesion,
	confirmAdhesion,
	retrieveAdhesions
};

export default AdherentsApiClient;
