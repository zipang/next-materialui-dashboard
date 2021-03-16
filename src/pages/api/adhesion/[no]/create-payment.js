import { createPayment } from "@lib/client/MollieClient.js";

/**
 * That's the odd part. Currency values must be strings
 * formatted with a decimal part
 * @see https://docs.mollie.com/reference/v2/payments-api/create-payment
 */
const formatCurrency = (n) => n + ".00";

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
				value: formatCurrency(montant),
				currency: "EUR"
			},
			locale: "fr_FR",
			method: ["creditcard", "banktransfer"],
			description,
			redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/member/adhesions`,
			webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/adhesion/${no}/confirm-payment`
		});

		console.log(`Payment request created`, payment);

		return resp.status(200).json({
			success: true,
			redirectTo: payment._links.checkout.href
		});
	} catch (err) {
		console.error(err);
		const message = `Payment creation for adhesion ${no} has failed. (${err.message})`;
		resp.status(err.code || 500).json({
			success: false,
			error: message
		});
	}
};
