import { generatePdf } from "@lib/services/HtmlToPdf";

/**
 * The API entry point (POST) to transform an HTML into PDF
 * Expected body JSON format :
 * @example
 * {
 *     "html": "The <b>HTML</b> text body"
 * }
 */
export default async (req, resp) => {
	const { filename } = req.query; // Name of the PDF file name to return
	const { html, format } = req.body;
	try {
		console.log(`Received ${html} to convert to PDF`);
		const pdfBuffer = await generatePdf(html);

		if (format === "base64") {
			// Return a JSON response with the base64 encoded buffer
			const respBody = {
				success: true,
				filename,
				content: pdfBuffer.toString("base64")
			};
			console.log(`PDF generate response`, respBody);
			resp.json(respBody);
		} else {
			// Render the PDF inline
			resp.setHeader("Content-Disposition", `inline; filename="${filename}"`);
			resp.setHeader("Content-Length", pdfBuffer.length);
			resp.setHeader("Content-Type", "application/pdf");
			resp.end(pdfBuffer, "binary");
		}
	} catch (err) {
		resp.status(err.code).json({
			success: false,
			error: err.message
		});
	}
};
