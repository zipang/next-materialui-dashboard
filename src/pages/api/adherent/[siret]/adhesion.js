import { create } from "@models/Adhesion.js";

/**
 * Create a new pending Adhesion record for the adherent [siret]
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	const { method } = req;
	const { siret } = req.query; // Actions is an array build with the path parts
	try {
		const data = req.body;
		console.log(`${method} ${req.url}. Siret : ${siret}`, data);
		// POST : /api/adherent/7889798/adhesion
		const adhesion = await create(siret, data);
		console.log(`New adhesion request created for adherent ${siret}`, adhesion);
		return resp.status(200).json({
			success: true,
			adhesion: adhesion.toJSON()
		});
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
