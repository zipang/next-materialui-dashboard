import { generatePdf } from "@lib/services/HtmlToPdf";
import { retrieveBySiret } from "@models/Adherent";
import { html, filename } from "@templates/appel-de-fond";

/**
 * Generate a PDF
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	try {
		const siret = req.query.siret.replace(".pdf", ""); // The api call has the pdf extension included : appel-de-fond/8998798.pdf
		const adherent = (await retrieveBySiret(siret)).toJSON();
		const year = new Date().getFullYear();
		const date = new Date().toLocaleDateString("fr");
		const adhesion = { montant: 200 }; // We could retrieve the next available adhesion number here but it's not sure..??
		const data = { adherent, adhesion, year, date };
		const pdfBuffer = await generatePdf(html(data));

		// Render the PDF as an attachment (force download)
		resp.status(200);
		resp.setHeader("Content-Disposition", `attachment; filename="${filename(data)}"`);
		resp.setHeader("Content-Length", pdfBuffer.length);
		resp.setHeader("Content-Type", "application/pdf");
		resp.end(pdfBuffer, "binary");
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
