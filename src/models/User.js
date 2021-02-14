import { getParseInstance } from "./ParseSDK.js";
import ApiError from "../lib/ApiError.js";

class User {
	constructor(userData) {
		// Just copy all the attributes
		Object.assign(this, userData);
	}

	/**
	 * @return {Boolean} TRUE si l'utilisateur a le profil adhérent
	 */
	isAdherent() {
		return Array.isArray(this.profiles) && this.profiles.indexOf("adherent") > -1;
	}

	/**
	 * @return {Boolean} TRUE si l'utilisateur a le profil admin Invie
	 */
	isAdmin() {
		return Array.isArray(this.profiles) && this.profiles.indexOf("admin") > -1;
	}

	/**
	 * @return {Array} la liste des organismes gérés par cet adhérent
	 */
	getOrganismes() {}
}

/**
 * Register a new User
 * @param {Object} userData
 * @return {Parse.User}
 */
export const register = (User.register = async (userData) => {
	try {
		const Parse = getParseInstance();

		if (!userData.username) {
			userData.username = userData.email;
		}
		// This registration process is only for adherents
		userData.profiles = ["adherent"];

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
 */
export const getByUsername = (User.getByUsername = async (username) => {
	try {
		const getUser = new Parse.Query(Parse.user);
		return await getUser(username);
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

export default User;
