import { suite } from "uvu";
import code from "@hapi/code";
import MailTemplate from "./MailTemplate.js";

const { expect } = code;

const mailTemplate = {
	subject: "Sending an Email",
	cc: "anonymous@nowhere.org",
	body: `
Hi **{{=it.firstName}} {{=it.lastName}}**,
You've got an HTML message.
Click here : https://google.com
`
};

const testData = {
	firstName: "John",
	lastName: "DOE"
};

const MailTemplateTestSuite = suite("Markdown to HTML conversion");

MailTemplateTestSuite("Build an email template", () => {
	const mail = new MailTemplate(mailTemplate);
	const message = mail
		.setRecipient("John DOE <john.doe@x.net>")
		.createMessage(testData);

	console.log("Test message", message);

	expect(message.to).to.equal("John DOE <john.doe@x.net>");
	expect(message.subject).to.equal("Sending an Email");
	expect(message.text).to.contain([
		"Hi **John DOE**",
		"Click here : https://google.com"
	]);
});

MailTemplateTestSuite.run();
