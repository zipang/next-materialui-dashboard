import suite from "baretest";
import { getParseInstance } from "./ParseSDK.js";
import code from "@hapi/code";

const { expect } = code;

import testAdherent from "./adherent-test.js";

let Parse;

const AdhesionTestSuite = suite("Adhesions model");

AdhesionTestSuite.before(() => {
	console.log(`getParseInstance()`);
	Parse = getParseInstance();
});

AdhesionTestSuite("Create a new Adhesion", async () => {
	const adh = await Parse.Adhesion.create(testAdherent.siret);

	console.log(adh);
	expect(adh.no).to.be.a.string();
});

AdhesionTestSuite("Retrieve current adhesions", async () => {
	const adhesions = await Parse.Adhesion.getAll();

	expect(adhesions).to.be.an.array();

	adhesions.forEach((adh) => expect(adh.no.length).to.equal(8));
});

export default AdhesionTestSuite;

/**
 * Check to see if we were launched from the command line to launch the test suite immediately
 */
(async () => {
	if (process.argv0) {
		// Running the test suite from the command line
		await AdhesionTestSuite.run();
	}
})();
