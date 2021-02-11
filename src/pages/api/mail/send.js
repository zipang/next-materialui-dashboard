import Mailer from "@lib/services/Mailer";

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

	// Recreate the Buffers in the attachments
	if (Array.isArray(message.attachments)) {
		message.attachments = message.attachments.map((a) => {
			a.content = Buffer.from(a.content);
			return a;
		});
	}

	try {
		const mailerResponse = await Mailer.sendMail(message);
		resp.json({
			success: true,
			message: `Mail '${subject}' sent`,
			...mailerResponse
		});
	} catch (err) {
		resp.status(err.code).json({
			success: false,
			error: err.message
		});
	}
};
