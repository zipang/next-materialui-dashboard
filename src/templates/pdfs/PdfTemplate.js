import { convertToHtml } from "../../lib/services/MarkdownToHtml.js";
import { generatePdf } from "../../lib/services/HtmlToPdf.js";
import dot from "dot";

/**
 * @param {String} filename
 * @param {String} content Markdown template
 */
function PdfTemplate({ filename, data, content }) {
	if (!filename) filename = data.filename;
	this.filename = dot.compile(filename);
	this.body = dot.compile(convertToHtml(content));
}
PdfTemplate.prototype = {
	/**
	 * Pass body through the template function
	 * Returns an object that is suitable as an attachment to use with nodemailer `transport.sendMessage()`
	 * @param {Object} data
	 * @return {Attachment}
	 */
	createAttachment: async function (data) {
		const content = await generatePdf(this.body(data));
		return {
			filename: this.filename(data),
			content
		};
	},

	/**
	 * Send the generated PDF to the HTTP response
	 * @param {Object} data
	 * @param {http.ServerResponse} resp
	 */
	inlineAttachment: async function (data, resp) {
		const { filename, content } = await this.createAttachment(data);
		resp.setHeader(`Content-Disposition: inline; filename="${filename}"`);
		resp.setHeader("Content-Length", content.size);
		resp.setHeader("Content-Type", "application/pdf");
		resp.end(content, "binary");
	}
};

export default PdfTemplate;
