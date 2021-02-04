import nodemailer from "nodemailer";
import ApiError from "../ApiError.js";
import { loadEnv } from "../utils/Env.js";

let transporter = null;

/**
 * @typedef Mail
 * @field {Function} sendMail
 */

/**
 * @return {Mail}
 */
const getTransporter = () => {
	if (typeof window === "undefined" && !transporter) {
		if (process.env.NODE_ENV === "test") {
			// Help us for the test
			console.log("Loading the environment variables");
			loadEnv();
		}

		const {
			SMTP_HOST,
			SMTP_PORT,
			SMTP_SECURE,
			SMTP_USER,
			SMTP_USERNAME,
			SMTP_PWD
		} = process.env;

		if (!SMTP_HOST || !SMTP_USER || !SMTP_USERNAME || !SMTP_PWD) {
			throw new ApiError(
				400,
				"Missing SMTP Transport environment variables (SMTP_HOST..)."
			);
		}

		const from = `${SMTP_USERNAME} <${SMTP_USER}>`;

		transporter = nodemailer.createTransport(
			{
				host: SMTP_HOST,
				port: SMTP_PORT,
				secure: SMTP_SECURE === "true", // use TLS
				auth: {
					user: SMTP_USER,
					pass: SMTP_PWD
				}
			},
			{
				from,
				replyTo: from
			}
		);
	}

	return transporter;
};

const Mailer = {
	sendMail: async ({ subject, text, html, recipient = {} }) => {
		// Check required parameters
		if (!subject || !text || !recipient) {
			throw new ApiError(400, "Missing parameter 'subject', 'text' or 'recipient'");
		}

		const { name, email } = recipient;
		if (!email) {
			throw new ApiError(400, "Missing parameter 'recipient.email'");
		}

		const message = {
			to: `${name} <${email}>`,
			subject,
			text,
			html
		};

		const transporter = getTransporter();

		try {
			console.log(`Sending the mail`, message);
			const resp = await transporter.sendMail(message);
			return resp;
		} catch (err) {
			console.error(`Mail not sent`, err);
			throw new ApiError(500, `Mail not send. ${err.message}`);
		}
	}
};

export default Mailer;
