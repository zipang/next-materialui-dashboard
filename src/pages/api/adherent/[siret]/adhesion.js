import { getParseInstance } from "@models/ParseSDK";

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
		const Parse = getParseInstance();
		// POST : /api/adherent/7889798/adhesion
		const adhesion = await Parse.Adhesion.create(siret, data);
		console.log(`New adhesion request created for adherent ${siret}`, adhesion);
		return resp.status(200).json({
			success: true,
			adhesion: adhesion.toJSON()
		});
	} catch (err) {
		resp.status(err.code).json({
			success: false,
			error: err.message
		});
	}
};
