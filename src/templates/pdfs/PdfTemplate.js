import { convertToHtml } from "../../lib/services/MarkdownToHtml.js";
import { generatePdf } from "../../lib/services/HtmlToPdf.js";
import dot from "dot";

/**
 * @param {String} filename
 * @param {String} body Markdown template
 */
function PdfTemplate({ filename, content }) {
	this.filename = filename;
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
			filename: this.filename,
			content
		};
	}
};

export default PdfTemplate;
