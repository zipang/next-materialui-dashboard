import { suite } from "uvu";
import { getParseInstance } from "./ParseSDK.js";
import { logIn } from "./User.js";
import code from "@hapi/code";

const { expect } = code;

import testData from "./organisme-test.js";
import testUser from "./test-user.js";

let Parse;

const OrganismeTestSuite = suite("Organismes model");

OrganismeTestSuite.before(() => {
	console.log(`getParseInstance()`);
	Parse = getParseInstance();
});

// OrganismeTestSuite("Create a new Organisme", async () => {
// 	const org = await new Parse.Organisme(testData);
// 	await org.save();
// 	console.log(org.toJSON());
// 	expect(org.createdAt).to.be.a.date();
// });

OrganismeTestSuite("Register an Organisme to a User", async () => {
	const owner = await logIn(testUser);
	const org = await Parse.Organisme.register(null, testData);
	console.log(org.toJSON());
	expect(org.createdAt).to.be.a.date();
	// await org.delete();
});

OrganismeTestSuite.run();
