import User from "@models/User";

/**
 * `/api/login` request handler
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
const login = async (req, resp) => {
	try {
		const userLogin = { ...req.body };
		const loggedUser = await User.logIn(userLogin);
		resp.json(loggedUser);
	} catch (err) {
		resp.status(err.status || 500).json({
			success: false,
			error: err.message
		});
	}
};

export default login;
