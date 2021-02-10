import fs from "fs-extra";
import path from "path";
import dirname from "../../../dirname.js";
import * as matter from "gray-matter";
import PdfTemplate from "./PdfTemplate.js";
import ApiError from "../../lib/ApiError.js";

// Export a map that allows to load a template by its name
const templates = {};

// if (process.env.NODE_ENV !== "test") {
// 	// Pre-load using Webpack gray-matter-loader
// 	// (Test environment doesn't support Webpack loaders)
// 	import("./attestation.md")
// 		.then((attestationContent) => {
// 			templates.attestation = new PdfTemplate(attestationContent.default);
// 		})
// 		.catch((err) => {
// 			console.error(`Pre-loading of attestation PDF template failed`, err);
// 		});
// }

/**
 * Dynamically load a local PDF template by its name
 * @param {String} name
 * @return {PdfTemplate}
 */
export const createPdfTemplate = (name) => {
	name = name.trim();
	if (!templates[name]) {
		const templateFile = path.join(dirname, "src/templates/pdfs", `${name}.md`);
		if (!fs.existsSync(templateFile)) {
			throw new ApiError(
				404,
				`PDF template for '${name}' doesn't exist (${templateFile})`
			);
		}
		console.log(matter);
		const templateContent = matter.default(fs.readFileSync(templateFile));
		templates[name] = new PdfTemplate(templateContent);
	}
	return templates[name];
};
