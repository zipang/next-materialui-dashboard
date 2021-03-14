import { getSearchParams } from "@lib/utils/Api";
import { retrieve } from "@models/Adhesion.js";

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	try {
		if (req.method === "OPTION") return resp.json({ success: true }); // CORS request start with an OPTION request
		const searchParams = getSearchParams(req);
		const rows = await retrieve(searchParams);
		resp.json({
			success: true,
			rows
		});
	} catch (err) {
		console.error(`${req.url}`, err);
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
