import { getParseInstance } from "@lib/services/ParseSDK";

/**
 * API handler for `/api/register` (User Registration)
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
const forgotPassword = async (req, resp) => {
	try {
		const Parse = getParseInstance();

		// Pass all the req body attributes to create a new User instance
		const { email } = req.body;
		await Parse.User.requestPasswordReset(email);

		resp.json({
			success: true,
			message: `Vérifiez votre boîte aux lettres pour l'email de réinitialisation`
		});
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: `API Call to /user/forgotPassword failed with error : ${err.message}`
		});
	}
};

export default forgotPassword;
