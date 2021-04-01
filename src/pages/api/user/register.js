import { getParseInstance } from "@models/ParseSDK.js";
import User from "@models/User.js";

/**
 * API handler for `/api/register` (User Registration)
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
const register = async (req, resp) => {
	try {
		const Parse = getParseInstance();

		// Get the data and define the username as the login
		const userData = req.body;
		const registeredUser = await User.register(userData);

		console.dir("Newly register user", registeredUser);
		resp.json(registeredUser);
	} catch (err) {
		console.error(err);
		resp.status(err.code || 500).json({
			success: false,
			error: `API Call to /user/register failed with error : ${err.message}`
		});
	}
};

export default register;
