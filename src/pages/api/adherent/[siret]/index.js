import { getParseInstance } from "@models/ParseSDK";

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
		const Parse = getParseInstance();
		switch (method) {
			case GET:
				// GET by siret : /api/adherent/7889798
				adherent = await Parse.Adherent.retrieveBySiret(siret);
				return resp.json({
					success: true,
					adherent: adherent.toJSON()
				});

			case POST:
				// POST : /api/adherent/7889798
				const data = req.body;
				adherent = await Parse.Adherent.retrieveBySiret(siret);
				// Update every property
				Object.keys(data).forEach((key) => {
					adherent.set(key, data[key]);
				});
				await adherent.save();
		}
	} catch (err) {
		resp.status(err.code).json({
			success: false,
			error: err.message
		});
	}
};
