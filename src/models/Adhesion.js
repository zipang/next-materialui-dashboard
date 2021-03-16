import Parse from "parse/node.js";
import { getParseInstance } from "./ParseSDK.js";
import { getNextAdhesionNumber, updateAdhesionNumber } from "./Parameters.js";
import { retrieveBySiret } from "./Adherent.js";
import ApiError from "../lib/ApiError.js";

// Extract these fields only when requesting a list
const _DEFAULT_FIELD_LIST = [
	"no",
	"siret",
	"nom",
	"mode_paiement",
	"date_debut",
	"date_fin",
	"statut"
];

/**
 * This is the server only model to manipulate Adhesion
 */
class _Adhesion extends Parse.Object {
	constructor(data) {
		// Just copy all the attributes
		super("Adhesion", data);
		// return ParseProxy(this); // Will proxy to the get and set methods for all not found properties
	}
}

Parse.Object.registerSubclass("Adhesion", _Adhesion);

// StaticMethods

/**
 * Create a new Adhesion and generate a new number
 * @param {String} siret Unique Adherent ID
 * @param {Object} data Additional adhesion fields
 * @return Adhesion
 */
export const create = async (siret, data = {}) => {
	let no;
	try {
		const adherent = await retrieveBySiret(siret);
		// Get the next unique number
		no = await getNextAdhesionNumber();
		const adhesion = new _Adhesion({
			no,
			siret,
			statut: "en_attente",
			nom: adherent.get("nom"), // We need that duplicate information to avoid fetching the whole adherent
			...data
		});
		adhesion.set("adherent", adherent);
		await adhesion.save(null, { cascadeSave: false });
		// Ok we can update the next adhesion no
		await updateAdhesionNumber(no);
		return adhesion;
	} catch (err) {
		console.error(err);
		throw new ApiError(
			err.code || 500,
			`Creation of new adhesion ${no} for '${siret}' failed : ${err.message}`
		);
	}
};

/**
 * Retrieve a list of Adhesion that match some filter by example criterias
 * @param {Object} params
 * @param {Array<String>} fields An array of field names to include
 * @return {Array<Object>} These will not be Parse.Object
 */
export const retrieve = async (params = {}, fields = _DEFAULT_FIELD_LIST) => {
	try {
		const Parse = getParseInstance();
		const query = new Parse.Query("Adhesion");
		query.select(fields);
		Parse.addQueryParameters(query, params);
		const adhesions = await query.findAll();
		return adhesions.map((adh) => adh.toJSON());
	} catch (err) {
		console.error(err);
		throw new ApiError(err.code || 500, `Failed loading adhesions : ${err.message}`);
	}
};

/**
 * Retrieves an existing Adhesion by its unique number
 * @param {String} no
 * @return {Adhesion}
 */
export const retrieveByNo = async (no) => {
	const Parse = getParseInstance(); // Because this instance has been augmented with new utility methods
	return Parse.retrieveByUniqueKey("Adhesion", "no", no);
};

/**
 * Notify that the payment for this adhesion has been received.
 * Set the status of the adhesion and adherent to active
 * Set the dates
 * @param {String} no
 * @param {Object} data
 */
export const confirmPayment = async (no, data = {}) => {
	try {
		const adhesion = await retrieveByNo(no);
		// Check the date to which this adhesion should be active
		const currentDate = new Date().toISOString().substr(0, 10);
		const date_debut = adhesion.get("date_debut");
		if (!date_debut || currentDate > date_debut) {
			adhesion.set("date_debut", currentDate);
			const [year, month, day] = currentDate.split("-");
			adhesion.set(
				"date_fin",
				[
					(Number(year) + 1).toString(),
					month,
					day === "28" && month === "02" ? "27" : day
				].join("-")
			);
		}
		adhesion.set("statut", "active");
		adhesion.set("paiement", data);

		const adherent = adhesion.get("adherent");
		adherent.set("statut", "actif");

		await Promise.allSettled([adherent.save(), adhesion.save()]);
		return adhesion;
	} catch (err) {
		console.error(err);
		throw new ApiError(
			err.code || 500,
			`Payment confirmation for adhesion ${no} has failed : ${err.message}`
		);
	}
};
