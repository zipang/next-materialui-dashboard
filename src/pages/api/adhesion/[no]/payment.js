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
		const adhesion = await Parse.Adhesion.confirmPayment(no, req.body);

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
