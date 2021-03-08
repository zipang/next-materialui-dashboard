import { Adherent } from "@models/Adherent.js";

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
				adherent = await Adherent.retrieveBySiret(siret);
				return resp.json({
					success: true,
					adherent: adherent.toJSON()
				});

			case "POST":
				// POST : /api/adherent/7889798
				const data = req.body;
				adherent = await Adherent.retrieveBySiret(siret);
				// Update every property
				Object.keys(data).forEach((key) => {
					adherent.set(key, data[key]);
				});
				await adherent.save();
		}
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
