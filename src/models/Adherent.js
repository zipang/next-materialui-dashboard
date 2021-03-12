import Parse from "parse/node.js";
import { getParseInstance } from "./ParseSDK.js";
import ApiError from "../lib/ApiError.js";

const LIST_OPTIONS = {
	json: true,
	select: [""]
};

/**
 * This is the server only model to manipulate Adherent
 */
export class Adherent extends Parse.Object {
	constructor(data) {
		// Just copy all the attributes
		super("Adherent", data);
		// return ParseProxy(this); // Will proxy to the get and set methods for all not found properties
	}
}

// Parse.Object.registerSubclass("Adherent", _Adherent);

export const update = async (data) => {
	try {
		const { siret } = data;
		let adherent = await retrieveBySiret(siret);

		if (!adherent) {
			// Start with a creation
			adherent = new Adherent(data);
		} else {
			// Update every property
			adherent.set(data);
			// Object.keys(data).forEach((key) => {
			// 	adherent.set(key, data[key]);
			// });
		}
		return await adherent.save();
	} catch (err) {
		console.error("Adherent.update()", err);
		throw new ApiError(
			err.code || 500,
			`Update of adherent '${data.nom}' failed : ${err.message}`
		);
	}
};

/**
 * Retrieves an existing Adherent by its siret number
 * @param {String} siret
 * @return {Adherent}
 */
export const retrieveBySiret = async (siret) => {
	const Parse = getParseInstance(); // Because this instance has been augmented with new utility methods
	return Parse.retrieveByUniqueKey("Adherent", "siret", siret);
};

/**
 * Retrieve a list of Adherent that match some filter by example criterias
 * @param {Object} params
 */
export const retrieve = async (params = {}) => {
	try {
		const Parse = getParseInstance();
		const query = new Parse.Query("Adherent");
		Parse.addQueryParameters(query, params);
		return query.findAll();
	} catch (err) {
		console.error(err);
		throw new ApiError(err.code || 500, `Failed loading adherents : ${err.message}`);
	}
};
