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
 * @param {Boolean} decodeBuffer Keep the buffer as a base64 encoded string or restore it ?
 * @return {Promise<PdfAttachment>} suitable to use as a message attachment in `nodemailer.send(message)`
 */
export const generateFromHtml = async (filename, html, decodeBuffer = true) => {
	try {
		const { content } = await APIClient.post(`/api/pdf/${filename}`, {
			html,
			format: "base64" // the returned buffer will be encoded as a base64 string
		});

		return {
			content: decodeBuffer ? Buffer.from(content, "base64") : content,
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
