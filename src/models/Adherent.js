import Parse from "parse/node.js";
import { getParseInstance } from "./ParseSDK.js";
import ParseProxy from "./ParseProxy.js";
import ApiError from "../lib/ApiError.js";

/**
 * This is the server only model to manipulate Adherent
 */
class _Adherent extends Parse.Object {
	constructor(data) {
		// Just copy all the attributes
		super("Adherent", data);
		// return ParseProxy(this); // Will proxy to the get and set methods for all not found properties
	}

	/**
	 * @return {Parse.User} The User that has created this adherent
	 */
	getOwner() {
		this.fetch();
		return this.owner;
	}
}

Parse.Object.registerSubclass("Adherent", _Adherent);

const StaticMethods = {
	/**
	 * Register a new Adherent
	 * @param {Parse.User} owner
	 * @param {Object} orgData
	 * @return Adherent
	 */
	register: async (owner, orgData) => {
		try {
			const org = new _Adherent(orgData);
			org.set("owner", owner);
			delete org.env; // Silly
			return await org.save(null, { cascadeSave: false });
		} catch (err) {
			console.error("Adherent.register()", err);
			if (err.code === 137) {
				throw new ApiError(
					409,
					`Adherent with siret '${orgData.siret}' already exist`
				);
			} else {
				throw new ApiError(
					err.code || 500,
					`Registration of adherent '${orgData.nom}' failed : ${err.message}`
				);
			}
		}
	},

	/**
	 * Retrieves an existing Adherent by its siret number
	 * @param {String} siret
	 * @return {Adherent}
	 */
	retrieveBySiret: async (siret) => {
		const Parse = getParseInstance(); // Because this instance has been augmented with new utility methods
		return Parse.retrieveByUniqueKey("Adherent", "siret", siret);
	},

	/**
	 * Retrieve a list of Adherent that match some filter by example criterias
	 * @param {Object} params
	 */
	retrieve: async (params = {}) => {
		try {
			const Parse = getParseInstance();
			const query = new Parse.Query("Adherent");
			return query.findAll();
		} catch (err) {
			console.error(err);
			throw new ApiError(
				err.code || 500,
				`Failed loading adherents : ${err.message}`
			);
		}
	}
};

Parse.Adherent = Object.assign(_Adherent, StaticMethods);
