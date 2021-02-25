import Parse from "parse/node.js";
import { getParseInstance } from "./ParseSDK.js";
import ParseProxy from "./ParseProxy.js";
import ApiError from "../lib/ApiError.js";

/**
 * This is the server only model to manipulate Adhesion
 */
class _Adhesion extends Parse.Object {
	constructor(data) {
		// Just copy all the attributes
		super("Adhesion", data);
		// return ParseProxy(this); // Will proxy to the get and set methods for all not found properties
	}

	/**
	 * @return {Parse.Adherent} The Adherent
	 */
	getAdherent() {
		this.fetch();
		return this.adherent;
	}
}

Parse.Object.registerSubclass("Adhesion", _Adhesion);

// StaticMethods

/**
 * Return the next available Adhesion number available for creation
 * @return {String} YYYY-999
 */
export const getNextNumber = async () => {
	const currentYear = new Date().getFullYear().toString();
	const Parse = getParseInstance();
	const query = new Parse.Query("Adhesion");
	const latest = query.first(); // Get the latest record
	const currentCounter = latest?.get("no");
	// Nothing found : let's start from here a now !
	if (!currentCounter) {
		return `${currentYear}-001`;
	} else {
		// Increment that counter
		const [year, counter] = currentCounter.split("-");
		if (year === currentYear) {
			return `${year}-${(Number(counter) + 1001).substr(1, 3)}`;
		} else {
			return `${currentYear}-001`;
		}
	}
};

/**
 * Create a new Adhesion and generate a new number
 * @param {Parse.Adherent} adherent
 * @param {Object} adhesion
 * @return Adhesion
 */
export const create = async (adherent, adhesion) => {
	if (process.env.NODE_ENV !== "production") {
		// fs.writeJSON(`./${adhesion.siret}.json`, adhesion);
	}
	// if (!owner && process.env.NODE_ENV === "production") {
	// 	throw new ApiError(403, "You are not logged.");
	// }
	try {
		// Get the next unique number
		const no = await getNextNumber();
		const adh = new _Adhesion(adhesion);
		adh.set("adherent", adherent);
		return await adh.save(null, { cascadeSave: false });
	} catch (err) {
		console.error(err);
		throw new ApiError(
			err.code || 500,
			`Creation of adhesion '${adhesion.no}' failed : ${err.message}`
		);
	}
};

/**
 * Retrieves an existing Adhesion by its unique number
 * @param {String} siret
 * @return {Adhesion}
 */
export const retrieveByNo = async (no) => {
	const Parse = getParseInstance(); // Because this instance has been augmented with new utility methods
	return Parse.retrieveByUniqueKey("Adhesion", "no", no);
};

/**
 * Retrieve a list of Adhesion that match some filter by example criterias
 * @param {Object} params
 */
export const getAll = async (params = {}) => {
	try {
		const Parse = getParseInstance();
		const query = new Parse.Query("Adhesion");
		return query.findAll();
	} catch (err) {
		console.error(err);
		throw new ApiError(err.code || 500, `Failed loading adherents : ${err.message}`);
	}
};

Parse.Adhesion = Object.assign(_Adhesion, {
	getNextNumber,
	create,
	retrieveByNo,
	getAll
});
