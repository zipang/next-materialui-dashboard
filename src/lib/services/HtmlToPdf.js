import ApiError from "../ApiError.js";
import { getInstance, closeInstance } from "./Chrome.js";

/**
 * @see https://github.com/puppeteer/puppeteer/blob/v7.0.3/docs/api.md#pagepdfoptions
 */
const _DEFAULT_OPTIONS = {
	format: "A4",
	margin: {
		top: "2cm",
		bottom: "2cm",
		right: "2cm",
		left: "2cm"
	}
};

/**
 * Use headless Chrome instance through Puppeteer to Print a PDF page
 * @param {String} html
 * @param {PDFOptions} options
 * @return {Buffer}
 */
export const generatePdf = async (html, options) => {
	let browser;
	try {
		browser = await getInstance();
		const page = await browser.newPage();
		await page.setContent(html);
		const pdfBuffer = await page.pdf({ ..._DEFAULT_OPTIONS, ...options });
		return pdfBuffer;
	} catch (err) {
		console.error(err);
		throw new ApiError(500, "PDF Generation failed");
	} finally {
		browser && browser.close();
	}
};
