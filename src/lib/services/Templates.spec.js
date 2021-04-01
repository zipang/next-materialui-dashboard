import suite from "baretest.js";
import code from "@hapi/code.js";
import { render } from "./Templates.js";
import { loadEnv } from "../utils/Env.js";

const { expect } = code;
const TemplatesTestSuite = suite("Render Templates");
loadEnv();

const testData = {
	siret: "12345678901234",
	nom: "ACME SA",
	date_creation: "2018-01-01",
	representant: {
		prenom: "Bob",
		nom: "Avery",
		email: "bob.avery@acme.sa",
		mobile: "06 67 78 89 90"
	}
};

TemplatesTestSuite("Render the welcome email template", async () => {
	const welcomeMail = await render("welcome", testData);
	console.log(welcomeMail);
	expect(welcomeMail.to).to.equal("Bob Avery <bob.avery@acme.sa>");
});

export default TemplatesTestSuite;
