import { getParseInstance } from "@models/ParseSDK";

/**
 * // POST : /api/adhesion/2020-012/payment
 * Receive the payment confirmation for a pending adhesion
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	const { no } = req.query;
	try {
		const Parse = getParseInstance();

		const data = req.body;
		const adhesion = await Parse.Adhesion.retrieveByNo(no);

		// Check the date to which this adhesion should be active
		const currentDate = new Date().toISOString().substr(0, 10);
		const date_debut = adhesion.get("date_debut");
		if (!date_debut || currentDate > date_debut) {
			adhesion.set("date_debut", currentDate);
		}
		adhesion.set("statut", "active");
		adhesion.set("payment", data);

		await adhesion.save();

		return resp.status(200).json({
			success: true,
			adhesion: adhesion.toJSON()
		});
	} catch (err) {
		const message = `Payment confirmation of adhesion ${no} has failed. (${err.message})`;
		resp.status(err.code || 500).json({
			success: false,
			error: message
		});
	}
};
