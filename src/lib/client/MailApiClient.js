import APIClient from "./ApiClient";
import ApiError from "@lib/ApiError";
import { render } from "@lib/services/Templates";

/**
 * Use a named template to build a message and send it
 * @param {String} name
 * @param {Object} data
 */
export const sendMailTemplate = async (name, data) => {
	try {
		const message = await render(name, data);
		return await sendMessage(message);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

/**
 * Send the fully constructed MailMessage through the local API
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
	sendMailTemplate,
	sendMessage
};

export default MailApiClient;
