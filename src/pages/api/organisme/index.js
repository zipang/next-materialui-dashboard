import { getParseInstance } from "@models/ParseSDK";

const getSearchParams = (url) => {};

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	try {
		if (req.method === "OPTION") return resp.json({ success: true }); // CORS request start with an OPTION request
		const searchParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
		const Parse = getParseInstance();
		const rows = await Parse.Organisme.retrieve(searchParams);
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
