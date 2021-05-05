import suite from "baretest";
import code from "@hapi/code";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { getTemplate } from "./index.js";
import testAdherent from "../models/adherent-test.js";
import testAdhesion from "../models/adhesion-test.js";
import { loadEnv } from "../lib/utils/Env.js";

const { expect } = code;
const TemplateSuite = suite("templates");

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

loadEnv("test");

/**
 * Check the API
 */
TemplateSuite("Load a template by name", async () => {
	const adhesionTemplate = await getTemplate("adhesion");

	expect(adhesionTemplate).to.be.a.function();

	const mailTemplate = adhesionTemplate(testAdherent);
});

export default TemplateSuite;

/**
 * Check to see if we were launched from the command line to launch the test suite immediately
 */
(async () => {
	if (process.argv0) {
		// Running the test suite from the command line
		await TemplateSuite.run();
	}
})();
