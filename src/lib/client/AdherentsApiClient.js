import APIClient from "./ApiClient";
import ApiError from "@lib/ApiError";

/**
 * Let a user update some informations about an existing adherent
 * @param {Object} user
 * @param {Object} data
 */
export const update = async (user, data) => {
	try {
		if (user) {
			data.owner = user.username;
		}
		return await APIClient.post(`/api/adherent/${data.siret}`, data);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

/**
 * Create a new pending adhesion request for this adherent
 */
export const createAdhesion = async (user, siret, data = {}) => {
	try {
		if (user) {
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
	return await APIClient.post(`/api/adhesion/${no}/payment`, data);
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
	return await APIClient.get(`/api/adherent/${siret}`, params);
	try {
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
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
