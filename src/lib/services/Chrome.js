import puppeteer from "puppeteer";
import ApiError from "../ApiError.js";

let chromium;

/**
 * Creates and return a new Puppeteer browser instance
 * Using Headless Chrome
 * @returns {puppeteer.Browser}
 */
export const getInstance = async () => {
	if (process.env.NODE_ENV === "production") {
		// @TODO: Non-api routes attempt these requires and will fail (chrome-aws-lambda is stripped out)
		// Instead handle the require only when we hit the entrypoint where its actually needed (i.e only api routes)
		// It should be investigated why the require was being handled in the first place. Probably just some tree-shaking required
		if (!chromium) {
			try {
				chromium = (await import("chrome-aws-lambda")).default;
			} catch (err) {
				console.error(err);
				throw new ApiError(500, "AWS Chrome failed to load");
			}
		}
		return await puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
			ignoreHTTPSErrors: true
		});
	} else {
		// For dev and test environments we have the full puppeteer package installed
		return await puppeteer.launch({
			ignoreHTTPSErrors: true
		});
	}
};

export const closeInstance = async (browser) => {
	return await browser.close();
};
