import { suite } from "uvu";
import code from "@hapi/code";
import MailTemplate from "./MailTemplate.js";
import PdfTemplate from "../pdfs/PdfTemplate.js";

const { expect } = code;

export const mailTemplate = {
	subject: "Sending an Email",
	cc: "anonymous@nowhere.org",
	content: `
Hi **{{=it.firstName}} {{=it.lastName}}**,
You've got an HTML message.
Click here : https://google.com
`
};

const pdfTemplate = {
	filename: "{{=it.firstName}} {{=it.lastName}}.pdf",
	content: `
Hello **{{=it.firstName}} {{=it.lastName}}**
Thank you for your purchase.
Here is tour receipt.
`
};

const testData = {
	firstName: "John",
	lastName: "DOE"
};

const MailTemplateTestSuite = suite("Markdown to HTML conversion");

MailTemplateTestSuite("Build an email template", async () => {
	try {
		const mail = new MailTemplate(mailTemplate);
		const message = await mail
			.setRecipient("John DOE <john.doe@x.net>")
			.createMessage(testData);
		console.log("Test message", message);
		expect(message.to).to.equal("John DOE <john.doe@x.net>");
		expect(message.subject).to.equal("Sending an Email");
		expect(message.text).to.contain([
			"Hi **John DOE**",
			"Click here : https://google.com"
		]);
	} catch (err) {
		console.error(err);
	}
});

MailTemplateTestSuite("Build an email template with PDF attachment", async () => {
	const mail = new MailTemplate(mailTemplate).addAttachment(
		new PdfTemplate(pdfTemplate)
	);
	const message = await mail
		.setRecipient("John DOE <john.doe@x.net>")
		.createMessage(testData);
	console.log("Test message", message);
	expect(message.attachments).to.be.an.array();
	expect(message.attachments[0].filename).to.equal("John DOE.pdf");
	expect(message.attachments[0].content).to.be.a.buffer();
});

MailTemplateTestSuite.run();
