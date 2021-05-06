import suite from "baretest";
import code from "@hapi/code";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { getTemplate } from "./index.js";
import testAdherent from "../models/adherent-test.js";
import adhesions_report from "./adhesions-report-test.js";
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
	const render = await getTemplate("adhesion");
	expect(render).to.be.a.function();

	const mailTemplate = render(testAdherent);
});

TemplateSuite("Render the 'adhesions_report' template with some test data", async () => {
	const render = await getTemplate("adhesions_report");
	expect(render).to.be.a.function();

	const rendered = render(adhesions_report);
	console.log("adhesions_report", rendered);
	expect(rendered).to.be.an.object();
	expect(rendered.to).to.be.a.string();
	expect(rendered.subject).to.be.a.string();
	expect(rendered.html).to.be.a.string();
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
