import APIClient from "./ApiClient";
import ApiError from "@lib/ApiError";

/**
 * Use a named template to build a message and send it by mail
 * @param {String} name
 * @param {Object} data
 */
export const sendMailTemplate = async (name, data) => {
	try {
		const { content } = await renderTemplate(name, data);
		return await sendMessage(content);
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

/**
 * Send the fully constructed MailMessage through the local API
 * @param {String} name Template name
 * @param {Object} data Data to render
 * @return {Object}
 */
export const renderTemplate = async (name, data) => {
	try {
		return await APIClient.post(`/api/template/${name}`, data);
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

const MailApiClient = {
	renderTemplate,
	sendMailTemplate,
	sendMessage
};

export default MailApiClient;
