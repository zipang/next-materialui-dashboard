import Parse from "parse/node.js";
import { getParseInstance } from "./ParseSDK.js";
import ParseProxy from "./ParseProxy.js";
import ApiError from "../lib/ApiError.js";

/**
 * This is the server only model to manipulate Parameters
 */
class _Parameters extends Parse.Object {
	constructor(data) {
		// Just copy all the attributes
		super("Parameters", data);
		// return ParseProxy(this); // Will proxy to the get and set methods for all not found properties
	}
}

Parse.Object.registerSubclass("Parameters", _Parameters);

// StaticMethods

export const retrieve = async () => {
	const Parse = getParseInstance();
	const query = new Parse.Query("Parameters");
	query.equalTo("env", process.env.NODE_ENV);
	let envParameters = await query.first(); // Get the latest record
	if (!envParameters) {
		envParameters = new _Parameters({
			env: process.env.NODE_ENV,
			no_adhesion: new Date().getFullYear() + "-000"
		});
		envParameters = await envParameters.save();
	}
	console.log(`Retrieved parameters for env ${process.env.NODE_ENV}`, envParameters);
	return envParameters;
};

/**
 * Return the next available Parameters number available for creation
 * @return {String} YYYY-999
 */
export const getNextAdhesionNumber = async () => {
	const currentYear = new Date().getFullYear().toString();
	const envParameters = await retrieve();
	const currentCounter = envParameters.get("no_adhesion");
	const [year, counter] = currentCounter.split("-");
	if (year === currentYear) {
		// Increment that counter
		console.log(`Incrementing adhesion counter`);
		return `${year}-${(Number(counter) + 1001).toString().substr(1, 3)}`;
	} else {
		// It's a new year counter
		return `${currentYear}-001`;
	}
};

/**
 * Update Parameters to the new provided adhesion number
 * @param {String} no
 */
export const updateAdhesionNumber = async (no) => {
	console.log(`Saving next adhesion no to parameters ${no}`);
	try {
		const params = await retrieve();
		params.set("no_adhesion", no);
		await params.save();
		return params;
	} catch (err) {
		console.error(err);
		throw new ApiError(
			err.code || 500,
			`Parameters no_adhesion update failed : ${err.message}`
		);
	}
};

export const Parameters = Object.assign(_Parameters, {
	retrieve,
	getNextAdhesionNumber
});
