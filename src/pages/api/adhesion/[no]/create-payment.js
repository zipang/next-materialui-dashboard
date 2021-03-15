import { createPayment } from "@lib/client/MollieClient.js";

/**
 * // POST : /api/adhesion/2020-012/create-payment
 * Receive the payment confirmation for a pending adhesion
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
export default async (req, resp) => {
	const { no } = req.query;
	try {
		const { montant, description } = req.body;
		const payment = await createPayment({
			amount: {
				value: montant,
				currency: "EUR"
			},
			description,
			redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/member/adhesions`,
			webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/adhesion/${no}/confirm-payment`
		});

		return resp.status(200).json({
			success: true,
			redirectTo: payment.checkoutUrl
		});
	} catch (err) {
		const message = `Payment creation for adhesion ${no} has failed. (${err.message})`;
		resp.status(err.code || 500).json({
			success: false,
			error: message
		});
	}
};
