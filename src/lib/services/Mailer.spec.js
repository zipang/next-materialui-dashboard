import suite from "baretest.js";
import code from "@hapi/code.js";
import Mailer from "./Mailer.js";
import { loadEnv } from "../utils/Env.js";

loadEnv();
const { expect } = code;
const MailerTestSuite = suite("Mailer Test Suite");

const shouldSucceed = async () => {
	return await Mailer.sendMail({
		subject: "TEST MAIL (do not respond)",
		text: `This is the text body.
No formatted text.`,
		html: `This is the text body.<br/><i>Fancy Looking</i>`,
		to: {
			name: "zipang",
			address: "christophe.desguez@gmail.com"
		}
	});
};

const shouldFail = async () => {
	return await Mailer.sendMail({
		text: `This is the text body. I have no subject.`
	});
};

MailerTestSuite("Checking bad parameters responses", async () => {
	try {
		await shouldFail();
	} catch (err) {
		expect(err.code).to.equal(400);
		expect(err.message).to.equal("Missing parameter 'subject', 'text' or 'to'");
	}
});

MailerTestSuite("Sending myself a test email", async () => {
	const success = await shouldSucceed();
	console.log(`MailerTestSuite`, success);
	expect(success).to.be.an.object();
});

export default MailerTestSuite;
