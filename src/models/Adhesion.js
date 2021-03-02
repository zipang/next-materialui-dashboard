import Parse from "parse/node.js";
import { getParseInstance } from "./ParseSDK.js";
import { getNextAdhesionNumber, updateAdhesionNumber } from "./Parameters.js";
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
 * Create a new Adhesion and generate a new number
 * @param {String} siret Unique Adherent ID
 * @return Adhesion
 */
export const create = async (siret) => {
	try {
		const Parse = getParseInstance();
		const adherent = await Parse.Adherent.retrieveBySiret(siret);
		// Get the next unique number
		const no = await getNextAdhesionNumber();
		const adh = new _Adhesion({
			no,
			statut: "en_attente"
		});
		adh.set("adherent", adherent);
		await Promise.allSettled([
			adh.save(null, { cascadeSave: false }),
			updateAdhesionNumber(no)
		]);
		return adh.toJSON();
	} catch (err) {
		console.error(err);
		throw new ApiError(
			err.code || 500,
			`Creation of new adhesion for '${siret}' failed : ${err.message}`
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
		const adhesions = await query.findAll();
		return adhesions.map((adh) => adh.toJSON());
	} catch (err) {
		console.error(err);
		throw new ApiError(err.code || 500, `Failed loading adhesions : ${err.message}`);
	}
};

Parse.Adhesion = Object.assign(_Adhesion, {
	create,
	retrieveByNo,
	getAll
});
