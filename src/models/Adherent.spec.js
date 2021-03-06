import suite from "baretest";
import { getParseInstance } from "./ParseSDK.js";
import { logIn } from "./User.js";
import code from "@hapi/code";

const { expect } = code;

import testData from "./adherent-test.js";
import testUser from "./test-user.js";

let Parse;

const AdherentTestSuite = suite("Adherents model");

AdherentTestSuite.before(() => {
	console.log(`getParseInstance()`);
	Parse = getParseInstance();
});

// AdherentTestSuite("Create a new Adherent", async () => {
// 	const org = await new Parse.Adherent(testData);
// 	await org.save();
// 	console.log(org.toJSON());
// 	expect(org.createdAt).to.be.a.date();
// });

AdherentTestSuite("Register an Adherent to a User", async () => {
	const owner = await logIn(testUser);
	const org = await Parse.Adherent.register(null, testData);
	console.log(org.toJSON());
	expect(org.createdAt).to.be.a.date();
	// await org.delete();
});

export default AdherentTestSuite;

/**
 * Check to see if we were launched from the command line to launch the test suite immediately
 */
(async () => {
	if (process.argv0) {
		// Running the test suite from the command line
		await AdherentTestSuite.run();
	}
})();
