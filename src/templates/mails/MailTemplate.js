import { convertToHtml } from "../../lib/services/MarkdownToHtml.js";
import { createPdfTemplate } from "../pdfs/index.js";
import dot from "dot";

/**
 * @typedef MailTemplateDef
 * @param {String} subject Title of the mail
 * @param {String} content Markdown dot template
 * @param {String|Array} [cc=[]] Optional list of cc recipients
 * @param {String|Array} [bcc=[]] Optional list of bcc recipients
 * @param {Array} [attachments=[]] Optional list of Pdf templates to be included as attachments
 */

/**
 * Build a Mail template from a markdown + yaml front matter file
 * The markdown content must use the dot templating syntax
 * @see https://olado.github.io/doT/index.html
 * @param {MailTemplateDef} templateDef where the content is a markdown template
 */
function MailTemplate({ subject, content, cc = [], bcc = [], attachments = [] }) {
	if (!content || !subject) {
		throw new TypeError(
			`MailTemplate() constructor expect a non-empty 'subject' and 'content' field.`
		);
	}
	if (typeof attachments === "string") {
		// We've got only the name of the PDF templates
		// like : "attestation, facture"
		attachments = attachments.split(",").map((s) => createPdfTemplate(s.trim()));
	}
	Object.assign(this, { cc, bcc });
	this.subject = dot.compile(subject);
	this.text = dot.compile(content);
	this.html = dot.compile(convertToHtml(content));
	this.attachments = attachments.map(createPdfTemplate);
}
MailTemplate.prototype = {
	/**
	 * Pass data through the template function
	 * Returns a message object that is suitable to use with nodemailer `transport.sendMessage()`
	 * @param {Object} data
	 * @return {Promise<MailMessage>}
	 */
	createMessage: async function (data) {
		const attachments = await Promise.all(
			this.attachments.map((a) => a.createAttachment(data))
		);
		return {
			subject: this.subject(data),
			to: this.to || "",
			cc: this.cc,
			bcc: this.bcc,
			text: this.text(data),
			html: this.html(data),
			attachments
		};
	},
	/**
	 * Add a PDF attachment
	 * @param {PdfTemplate} pdfTemplate PDF template to render with the same data
	 */
	addAttachment: function (pdfTemplate) {
		this.attachments.push(pdfTemplate);
		return this;
	},
	/**
	 * Set the recipient
	 * @param {MessageAddress} to
	 * @return {MailTemplate} (chainable)
	 */
	setRecipient: function (to) {
		this.to = to;
		return this;
	}
};

export default MailTemplate;
