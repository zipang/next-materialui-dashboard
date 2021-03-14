import createMollieClient from "@mollie/api-client";

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
		const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
		const payment = await mollieClient.payments.create({
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
			redirectTo: payment.getCheckoutUrl()
		});
	} catch (err) {
		const message = `Payment creation for adhesion ${no} has failed. (${err.message})`;
		resp.status(err.code || 500).json({
			success: false,
			error: message
		});
	}
};
