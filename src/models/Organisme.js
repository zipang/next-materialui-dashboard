import Parse from "parse/node.js";
import { getParseInstance } from "./ParseSDK.js";
import ParseProxy from "./ParseProxy.js";
import ApiError from "../lib/ApiError.js";

/**
 * This is the server only model to manipulate Organisme
 */
class _Organisme extends Parse.Object {
	constructor(data) {
		// Just copy all the attributes
		super("Organisme", data);
		// return ParseProxy(this); // Will proxy to the get and set methods for all not found properties
	}

	/**
	 * @return {Parse.User} The User that has created this organisme
	 */
	getOwner() {
		this.fetch();
		return this.owner;
	}
}

Parse.Object.registerSubclass("Organisme", _Organisme);

const StaticMethods = {
	/**
	 * Register a new Organisme
	 * @param {Parse.User} owner
	 * @param {Object} orgData
	 * @return Organisme
	 */
	register: async (owner, orgData) => {
		if (process.env.NODE_ENV !== "production") {
			// fs.writeJSON(`./${orgData.siret}.json`, orgData);
		}
		// if (!owner && process.env.NODE_ENV === "production") {
		// 	throw new ApiError(403, "You are not logged.");
		// }
		try {
			const org = new _Organisme(orgData);
			org.set("owner", owner);
			delete org.env; // Silly
			return await org.save(null, { cascadeSave: false });
		} catch (err) {
			console.error(err);
			throw new ApiError(
				err.code || 500,
				`Registration of organisme '${orgData.nom}' failed : ${err.message}`
			);
		}
	},

	/**
	 * Retrieves an existing Organisme by its siret number
	 * @param {String} siret
	 * @return {Organisme}
	 */
	retrieveBySiret: async (siret) => {
		const Parse = getParseInstance(); // Because this instance has been augmented with new utility methods
		return Parse.retrieveByUniqueKey("Organisme", "siret", siret);
	},

	/**
	 * Retrieve a list of Organisme that match some filter by example criterias
	 * @param {Object} params
	 */
	retrieve: async (params = {}) => {
		try {
			const Parse = getParseInstance();
			const query = new Parse.Query("Organisme");
			return query.findAll();
		} catch (err) {
			console.error(err);
			throw new ApiError(
				err.code || 500,
				`Failed loading organismes : ${err.message}`
			);
		}
	}
};

Parse.Organisme = Object.assign(_Organisme, StaticMethods);
