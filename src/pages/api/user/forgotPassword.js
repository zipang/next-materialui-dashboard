import User from "@models/User";

/**
 * API handler for `/api/register` (User Registration)
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
const forgotPassword = async (req, resp) => {
	try {
		// Pass all the req body attributes to create a new User instance
		const { email } = req.body;
		await User.forgotPassword(email);

		resp.json({
			success: true,
			message: `Vérifiez votre boîte aux lettres pour l'email de réinitialisation`
		});
	} catch (err) {
		if (err.code === 404) {
			resp.status(404).json({
				success: false,
				error: `Email inconnu. Contactez le support si vous n'arrivez pas à retrouver votre compte.`
			});
		} else {
			resp.status(err.code || 500).json({
				success: false,
				error: `API Call to /user/forgotPassword failed with error : ${err.message}`
			});
		}
	}
};

export default forgotPassword;
