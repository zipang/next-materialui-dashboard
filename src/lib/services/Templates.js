import MailTemplate from "../../templates/mails/MailTemplate.js";
import ApiError from "@lib/ApiError";

import welcome from "../../templates/mails/welcome.md";

const mailTemplates = {
	welcome: new MailTemplate(welcome)
};

/**
 *
 * @param {String!} templateName
 * @param {Object} data
 * @return {MailMessage}
 */
export const createMessage = (templateName, data) => {
	const template = mailTemplates[templateName];

	if (!template) {
		throw new ApiError(500, `Unknown mail template ${templateName}`);
	}
	return template.createMessage(data);
};
