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
			"/organisme/register",
			registrationFormData
		);
		// We have to be sure that the registration was a success before sending the welcome email
		await sendMailTemplate("welcome", data);
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
		return await APIClient.post(`/organisme/${orgData.siret}`, orgData);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

const OrganismesApiClient = {
	register,
	update
};

export default OrganismesApiClient;
