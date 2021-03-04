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
		const Parse = getParseInstance();
		switch (method) {
			case GET:
				// GET by siret : /api/adherent/7889798
				const adherent = await Parse.Adherent.retrieveBySiret(siret);
				return resp.json({
					success: true,
					adherent: adherent.toJSON()
				});

			case POST:
			// POST : /api/adherent/7889798
		}
	} catch (err) {
		resp.status(err.code).json({
			success: false,
			error: err.message
		});
	}
};
