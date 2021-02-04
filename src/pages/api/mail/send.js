import Mailer from "@lib/server/Mailer";

/**
 * The API entry point (POST) to send an email
 * Expected body JSON format :
 * @example
 * {
 *     "subject": "Subject of the mail",
 *     "text": "The plain text body",
 *     "html": "The <b>HTML</b> text body",
 *     "recipient": {
 *         "name": "John DOE",
 *         "email": "john.doe@x.org"
 *     }
 * }
 */
export default async (req, resp) => {
	const { subject, text, html, recipient } = req.body;

	try {
		const mailerResponse = await Mailer.sendMail({
			subject,
			text,
			html,
			recipient
		});
		resp.json({
			success: true,
			message: `Mail '${subject}' sent`,
			...mailerResponse
		});
	} catch (err) {
		resp.status(err.code).json({
			sucess: false,
			error: err.message
		});
	}
};
