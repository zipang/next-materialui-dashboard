import { createPdfTemplate } from "../../../templates/pdfs/index";

/**
 * Add some usefull environment variables to the data objects
 * @param {Object} data
 */
const loadEnv = (data) => {
	data.env = {
		SITE_NAME: process.env.SITE_NAME,
		SITE_URL: process.env.SITE_URL
	};
};

/**
 * Render a PDF template using the data provided
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	const name = req.query.name; // Name of the PDF template to use
	const data = req.body; // Data to pass to the template
	try {
		// Get the data and define the username as the login
		loadEnv(data);
		const pdfTemplate = await createPdfTemplate(name);
		const { filename, content } = await pdfTemplate.createAttachment(data);

		resp.setHeader("Content-Disposition", `inline; filename="${filename}"`);
		resp.setHeader("Content-Length", content.length);
		resp.setHeader("Content-Type", "application/pdf");
		resp.end(content, "binary");
	} catch (err) {
		console.error(`/pdf/${name} generation error`, err);
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
