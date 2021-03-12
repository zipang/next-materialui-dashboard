import APIClient from "./ApiClient";
import ApiError from "@lib/ApiError";

/**
 * Get the list of organismes linked to a User
 * @param {Object} user
 */
export const getOrganismes = async (user) => {
	try {
		return await APIClient.get(`/api/user/organismes`, {
			username: user.username
		});
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

/**
 * Get the list of adhesions linked to a User
 * @param {Object} user
 */
export const getAdhesions = async (user) => {
	try {
		return await APIClient.get(`/api/user/adhesions`, {
			username: user.username
		});
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

const UsersApiClient = {
	getOrganismes,
	getAdhesions
};

export default UsersApiClient;
