import PdfTemplate from "./PdfTemplate.js";

// Preload all the local PDF templates using webpack gray-matter-loader
import attestationContent from "./attestation.md";
import ApiError from "../../lib/ApiError.js";
// Named export
export const attestation = new PdfTemplate(attestationContent);

// Export a map that allows to load a template by its name
const templates = {
	attestation
};

export const createPdfTemplate = (name) => {
	if (!templates[name]) {
		throw new ApiError(404, `PDF template for '${name}' doesn't exist`);
	}
	return templates[name];
};
