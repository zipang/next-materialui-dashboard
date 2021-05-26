import { getParseInstance } from "./ParseSDK.js";
import ApiError from "../lib/ApiError.js";
import { retrieve as retrieveOrganismes } from "./Adherent.js";
import { retrieve as retrieveAdhesions } from "./Adhesion.js";

let Parse;

class User {
	constructor(userData) {
		// Just copy all the attributes
		Object.assign(this, userData);
	}

	/**
	 * @return {Boolean} TRUE si l'utilisateur a le profil adhérent (membre)
	 */
	isAdherent() {
		return Array.isArray(this.profiles) && this.profiles.indexOf("member") > -1;
	}

	/**
	 * @return {Boolean} TRUE si l'utilisateur a le profil admin Invie
	 */
	isAdmin() {
		return Array.isArray(this.profiles) && this.profiles.indexOf("admin") > -1;
	}
}

/**
 * Register a new User
 * @param {Object} userData
 * @return {Parse.User}
 */
export const register = (User.register = async (userData) => {
	try {
		Parse = getParseInstance();

		if (!userData.username) {
			userData.username = userData.email;
		}
		// This registration process is only for adherents
		userData.profiles = ["member"];

		// Create a new Parse User instance
		const user = new Parse.User(userData);
		return await user.signUp();
	} catch (err) {
		throw new ApiError(
			500,
			`Echec de création d'un nouvel utilisateur : ${err.message}`
		);
	}
});

/**
 * Log the user
 */
export const logIn = (User.logIn = async ({ username, password }) => {
	try {
		Parse = getParseInstance();
		return await Parse.User.logIn(username, password);
	} catch (err) {
		if (err.code === Parse.Error.OBJECT_NOT_FOUND) {
			throw new ApiError(404, `Login ou mot de passe inconnu`);
		} else {
			throw new ApiError(
				err.code || 500,
				`Echec de l'authentification : ${err.message}`
			);
		}
	}
});

/**
 * Récupère un adhérent par son email (username)
 * @return {User}
 */
export const getByUsername = (User.getByUsername = async (username) => {
	try {
		Parse = getParseInstance();
		return await Parse.retrieveByUniqueKey("User", "username", username);
	} catch (err) {
		if (err.code === Parse.Error.OBJECT_NOT_FOUND) {
			throw new ApiError(404, `Login inconnu`);
		} else {
			throw new ApiError(
				err.code || 500,
				`Echec de l'authentification : ${err.message}`
			);
		}
	}
});

/**
 * Ask for a password re-generation link sent by email
 * @param {String} email
 */
export const forgotPassword = (User.forgotPassword = async (email) => {
	try {
		Parse = getParseInstance();

		// Re-verify the email
		const user = await getByUsername(email);

		if (user) {
			await Parse.User.requestPasswordReset(email);

			return user;
		} else {
			throw new ApiError(404, "Email inconnu");
		}
	} catch (err) {
		throw new ApiError(err.code || 500, err.message);
	}
});

/**
 * @param {String} username
 * @return {Array} la liste des organismes gérés par cet adhérent
 */
export const getOrganismes = (User.getOrganismes = async (username) => {
	return await retrieveOrganismes({ owner: username });
});

/**
 * @param {String} username
 * @return {Array} la liste des adhésions gérées par cet adhérent
 */
export const getAdhesions = (User.getAdhesions = async (username) => {
	return await retrieveAdhesions({ owner: username });
});

export default User;
