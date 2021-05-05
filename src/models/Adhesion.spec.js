import suite from "baretest";
import { getParseInstance } from "./ParseSDK.js";
import { create as createAdhesion, retrieve as retrieveAdhesions } from "./Adhesion.js";
import code from "@hapi/code";

const { expect } = code;

import testAdherent from "./adherent-test.js";
import testUser from "./test-user.js";

let Parse;

const AdhesionTestSuite = suite("Adhesions model");

AdhesionTestSuite.before(() => {
	console.log(`getParseInstance()`);
	Parse = getParseInstance();
});

AdhesionTestSuite("Create a new Adhesion", async () => {
	const adh = await createAdhesion(testUser, testAdherent.siret, {
		mode_paiement: "cheque"
	});

	console.log(adh); // It is a Parse Object
	expect(adh.get("no")).to.be.a.string();
	expect(adh.get("statut")).to.equal("en_attente");
	expect(adh.get("mode_paiement")).to.equal("cheque");
});

AdhesionTestSuite("Retrieve current adhesions", async () => {
	const adhesions = await retrieveAdhesions();
	console.log(`Retrieved adhesions`, adhesions);

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
