import { getParseInstance } from "./server/ParseSDK.js";
import ServerError from "./ServerError.js";

const Parse = getParseInstance();

class User {
	constructor(userData) {
		this._user = new Parse.User(userData);
	}
}

/**
 * Register a new User
 * @param {Object} userData
 * @return {Parse.User}
 */
export const register = (User.register = async (userData) => {
	try {
		// Pass all the req body attributes to create a new User instance
		const user = new Parse.User(userData);
		return await user.signUp();
	} catch (err) {
		throw new ServerError(
			`Echec de création d'un nouvel utilisateur : ${err.message}`
		);
	}
});

/**
 * Log the user
 */
export const logIn = (User.logIn = async ({ username, password }) => {
	try {
		return await Parse.User.logIn(username, password);
	} catch (err) {
		if (err.code === Parse.Error.OBJECT_NOT_FOUND) {
			throw new ServerError(`Login ou mot de passe inconnu`, 404);
		} else {
			throw new ServerError(
				`Echec de l'authentification : ${err.message}`,
				err.code
			);
		}
	}
});

export default User;
