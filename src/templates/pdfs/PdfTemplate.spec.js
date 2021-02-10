import { suite } from "uvu";
import code from "@hapi/code";
import PdfTemplate from "./PdfTemplate.js";

const { expect } = code;

export const pdfTemplate = {
	filename: "Greetings to {{=it.firstName}} {{=it.lastName}}.pdf",
	content: `
Hi **{{=it.firstName}} {{=it.lastName}}**,
Click here : https://google.com
`
};

const testData = {
	firstName: "John",
	lastName: "DOE"
};

const PdfTemplateTestSuite = suite("PDF Templates");

PdfTemplateTestSuite("Build a PDF from template", async () => {
	const pdf = new PdfTemplate(pdfTemplate);
	const attachment = await pdf.createAttachment(testData);
	console.log("Attachment", attachment);
	expect(attachment.filename).to.equal("Greetings to John DOE.pdf");
	expect(attachment.content).to.be.a.buffer();
});

PdfTemplateTestSuite.run();
