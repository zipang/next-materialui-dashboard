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
	if (envParameters === null) {
		envParameters = new _Parameters({
			env: process.env.NODE_ENV,
			no_adhesion: new Date().getFullYear() + "-000"
		});
		envParameters = await envParameters.save();
	}

	return envParameters.toJSON();
};

/**
 * Return the next available Parameters number available for creation
 * @return {String} YYYY-999
 */
export const getNextAdhesionNumber = async () => {
	const currentYear = new Date().getFullYear().toString();
	const envParameters = await retrieve();
	console.log(envParameters);
	const currentCounter = envParameters.get("no_adhesion");
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

Parse.Parameters = Object.assign(_Parameters, {
	retrieve,
	getNextAdhesionNumber
});
