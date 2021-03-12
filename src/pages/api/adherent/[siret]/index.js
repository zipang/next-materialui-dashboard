import { retrieveBySiret, update } from "@models/Adherent.js";

/**
 * Create a new pending Adhesion record for the adherent [siret]
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	const { method } = req;
	const { siret } = req.query; // Actions is an array build with the path parts
	let adherent;
	try {
		switch (method) {
			case "GET":
				// GET by siret : /api/adherent/7889798
				adherent = await retrieveBySiret(siret);
				return resp.json({
					success: true,
					adherent: adherent.toJSON()
				});

			case "POST":
				// POST : /api/adherent/7889798
				const data = req.body;
				adherent = await update(data);
				return resp.json({
					success: true,
					adherent: adherent.toJSON()
				});
		}
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
