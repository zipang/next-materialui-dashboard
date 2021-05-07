import Mailer from "@lib/services/Mailer.js";

/**
 * The API entry point (POST) to send an email
 * Expected body JSON format :
 * @example
 * {
 *     "subject": "Subject of the mail",
 *     "text": "The plain text body",
 *     "html": "The <b>HTML</b> text body",
 *     "to": [{
 *         "name": "John DOE",
 *         "address": "john.doe@x.org"
 *     }],
 *     "bcc": "logger@x.org"
 * }
 */
export default async (req, resp) => {
	const message = req.body;

	try {
		const mailerResponse = await Mailer.sendMail(message);
		resp.json({
			success: true,
			message: `Mail '${message.subject}' has been sent`,
			...mailerResponse
		});
	} catch (err) {
		console.error(err);
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
