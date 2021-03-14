import { getSearchParams } from "@lib/utils/Api";
import User from "@models/User.js";

/**
 * GET /api/user/organismes?username=john.doe@x.org
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	try {
		if (req.method === "OPTION") return resp.json({ success: true }); // CORS request start with an OPTION request
		const searchParams = getSearchParams(req);
		const username = searchParams.get("username");
		if (!username) {
			return resp.status(400).json({
				success: false,
				error: `Missing parameter 'username'`
			});
		} else {
			const rows = await User.getOrganismes(username);
			resp.json({
				success: true,
				rows
			});
		}
	} catch (err) {
		console.error(`${req.url}`, err);
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
