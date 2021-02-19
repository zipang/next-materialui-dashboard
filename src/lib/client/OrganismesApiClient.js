import APIClient from "./ApiClient";
import ApiError from "@lib/ApiError";
import { sendMailTemplate } from "./MailApiClient";

/**
 * Let user register a new organisme
 * @param {Object} user
 * @param {Object} registrationFormData
 */
export const register = async (user, registrationFormData) => {
	try {
		const registrationSuccess = await APIClient.post(
			"/api/organisme/register",
			registrationFormData
		);
		// We have to be sure that the registration was a success before sending the welcome email
		await sendMailTemplate("welcome", registrationFormData);
		return registrationSuccess;
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

/**
 * Let a user update some informations about an existing organisme
 * @param {Object} user
 * @param {Object} orgData
 */
export const update = async (user, orgData) => {
	try {
		return await APIClient.post(`/api/organisme/${orgData.siret}`, orgData);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

/**
 * Retrieve a list of Organismes following some criterias
 * (Filter by example)
 * @example
 *   const { rows } = await Parse.Organisme.retrieve({ nom: "*SARL" })
 *
 * @param {Object} params as key-value pairs
 */
export const retrieve = async (params = {}) => {
	try {
		return await APIClient.get(`/api/organisme`, params);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

const OrganismesApiClient = {
	register,
	retrieve,
	update
};

export default OrganismesApiClient;
