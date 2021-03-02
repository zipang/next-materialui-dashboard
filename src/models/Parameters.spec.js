import suite from "baretest";
import { getParseInstance } from "./ParseSDK.js";
import code from "@hapi/code";

const { expect } = code;

let Parse;

const ParametersTestSuite = suite("Parameters Model");

ParametersTestSuite.before(() => {
	Parse = getParseInstance();
});

ParametersTestSuite("Get the next adhesion number", async () => {
	const currentYear = new Date().getFullYear().toString();
	const params = await Parse.Parameters.retrieve();

	const no = params.no_adhesion;
	expect(no).to.be.a.string();

	// Split adhesion number
	const [year, counter] = no.split("-");
	expect(year.length).to.equal(4);
	expect(counter.length).to.equal(3);
});

ParametersTestSuite("Retrieve current parameters", async () => {
	const params = await Parse.Parameters.retrieve();

	expect(params.env).to.equal(process.env.NODE_ENV);
});

export default ParametersTestSuite;

/**
 * Check to see if we were launched from the command line to launch the test suite immediately
 */
(async () => {
	if (process.argv0) {
		// Running the test suite from the command line
		await ParametersTestSuite.run();
	}
})();
