import APIClient from "./ApiClient.js";
import ApiError from "../ApiError.js";
import { delay } from "@lib/utils/Promises.js";

/**
 * Use a named template to build a message and send it by mail
 * @param {String} name
 * @param {Object} data
 */
export const sendMailTemplate = async (name, data, ms = 0) => {
	try {
		const { content } = await renderTemplate(name, data);
		return await delay(ms, () => sendMessage(content));
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
		console.log(`Rendering template '${name}' with data`, data);
		return await APIClient.post(`/api/templates/${name}`, data);
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
