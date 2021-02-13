import { getParseInstance } from "../lib/services/ParseSDK.js";
import ParseProxy from "./ParseProxy.js";
import ApiError from "../lib/ApiError.js";
import fs from "fs-extra";

const Parse = getParseInstance();

class Organisme extends Parse.Object {
	constructor(data) {
		// Just copy all the attributes
		super("Organisme", data);
		return new ParseProxy(this); // Will proxy to the get and set methods for all not found properties
	}

	/**
	 * @return {Parse.User} The User that has created this organisme
	 */
	getOwner() {}
}

Parse.Object.registerSubclass("Organisme", Organisme);

/**
 * Register a new Organisme
 * @param {Parse.User} owner
 * @param {Object} orgData
 * @return Organisme
 */
Organisme.register = async (orgData) => {
	if (process.env.NODE_ENV === "test") {
		fs.writeJSON(`./${orgData.nom}.json`, orgData);
		return;
	}
	const owner = Parse.User.current();
	if (!owner && process.env.NODE_ENV === "production") {
		throw new ApiError(403, "You are not logged.");
	}
	try {
		const org = new Organisme(orgData);
		org.owner = owner;
		return await org.save(null, { cascadeSave: false });
	} catch (err) {
		console.error(err);
		throw new ApiError(
			err.code || 500,
			`Registration of organisme '${orgData.nom}' failed : ${err.message}`
		);
	}
};

/**
 * Retrieves an existing Organisme by its siret number
 * @param {String} siret
 * @return {Organisme}
 */
Organisme.retrieveBySiret = async (siret) => {
	return Parse.retrieveByUniqueKey("Organisme", "siret", siret);
};

export default Organisme;
