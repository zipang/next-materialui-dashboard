import APIClient from "./ApiClient";
import ApiError from "@lib/ApiError";

/**
 * @typedef Message
 * @param {String} filename
 * @param {Buffer} content Binary PDF content
 */

/**
 *
 * @param {Object} message
 * @return {Object}
 */
export const sendMessage = async (message) => {
	try {
		return await APIClient.post(`/api/mail/send`, message);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

const MailApiClient = {
	sendMessage
};

export default MailApiClient;
