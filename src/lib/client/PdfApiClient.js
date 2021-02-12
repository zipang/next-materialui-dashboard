import APIClient from "./ApiClient.js";
import ApiError from "../ApiError.js";

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
			format: decodeBuffer ? "Buffer" : "base64",
			filename
		};
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
};

const PdfApiClient = {
	generateFromHtml
};

export default PdfApiClient;
