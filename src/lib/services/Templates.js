import { getTemplate } from "../../templates/index.js";
import { generateFromHtml } from "../client/PdfApiClient.js";
import ApiError from "../ApiError.js";

const loadEnv = (data) => {
	data.env = process.env;
};

/**
 * Create a message from a mail template
 * @param {String!} templateName
 * @param {Object} data
 * @return {MailMessage}
 */
export const render = async (templateName, data) => {
	try {
		const template = await getTemplate(templateName);
		console.log(`Loaded template ${templateName}`, template);

		// Add the environment variables
		loadEnv(data);

		// Render the template by applying the data
		const message = template(data);

		if (message.attachments) {
			// Now we've got to render the attachments : each attachment is just the name of the next template to use
			const attachmentNames = message.attachments
				.split(",")
				.map((name) => name.trim());

			message.attachments = await Promise.all(
				attachmentNames.map(async (name) => {
					const attachmentTemplate = await getTemplate(name);
					const { filename, html } = attachmentTemplate(data);
					// And last thing last : we must convert this html to a base64 encoded PDF string
					return await generateFromHtml(filename, html, false);
				})
			);
		}

		return message;
	} catch (err) {
		console.error(err);
		throw new ApiError(
			err.code || 500,
			`Generation of template ${templateName} failed`
		);
	}
};
