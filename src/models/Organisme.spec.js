import { suite } from "uvu";
import { getParseInstance } from "./ParseSDK.js";
import code from "@hapi/code";

const { expect } = code;

const testData = {
	siret: "1234567",
	nom: "ACME ORG",
	representant: {
		prenom: "Bob",
		nom: "Avery",
		email: "bob.avery@acme.org"
	},
	contact: {
		telephone: "01 23 45 67 89",
		email: "contact@acme.org"
	}
};

let Parse;

const OrganismeTestSuite = suite("Organismes model");

OrganismeTestSuite.before(() => {
	Parse = getParseInstance();
});

OrganismeTestSuite("Create a new Organisme", async () => {
	const org = new Parse.Organisme(testData);
	await org.save();
});

OrganismeTestSuite.run();
