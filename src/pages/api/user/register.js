import { getParseInstance } from "@lib/server/ParseSDK";

/**
 * API handler for `/api/register` (User Registration)
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
const register = async (req, resp) => {
	try {
		const Parse = getParseInstance();

		// Pass all the req body attributes to create a new User instance
		const user = new Parse.User({ ...req.body });
		console.dir("Trying to register user", user);
		const registeredUser = await user.signUp();

		resp.json(registeredUser);
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: `API Call to /user/register failed with error : ${err.message}`
		});
	}
};

export default register;
