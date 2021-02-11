import APIClient from "./ApiClient";
import ApiError from "@lib/ApiError";

/**
 * @typedef PdfAttachment
 * @param {String} filename
 * @param {Buffer} content Binary PDF content
 */

/**
 *
 * @param {String} filename
 * @param {String} html
 * @return {Promise<PdfAttachment>} suitable to use as a message attachment in `nodemailer.send(message)`
 */
export const generateFromHtml = async (filename, html) => {
	try {
		const { content } = await APIClient.post(`/api/pdf/${filename}`, {
			html,
			format: "base64"
		});

		return {
			content: Buffer.from(content, "base64"),
			filename
		};
	} catch (err) {
		console.error(err);
		throw new ApiError(err.code || 500, err.message);
	}
};

const PdfClient = {
	generateFromHtml
};

export default PdfClient;
