#!/usr/bin/env node

import { retrieveBySiret } from "../models/Adherent.js";
import { delay } from "../lib/utils/Promises.js";
import { getParseInstance } from "../models/ParseSDK.js";

const updateAdhesion = async (adhesion) => {
	console.log(adhesion);
	try {
		const adherent = await retrieveBySiret(adhesion.get("siret"));
		// console.log(`Merging data on ${adherent.nom}`, merged);
		adhesion.set("adherent", adherent);
		await adhesion.save(null, { cascadeSave: false });
	} catch (err) {
		console.error(err, adhesion.toJSON());
	}
};

const runCmd = async () => {
	try {
		const Parse = getParseInstance();
		const query = new Parse.Query("Adhesion");
		query.select(["no", "siret", "nom"]);
		const allAdhesions = await query.findAll();

		for (const adh of allAdhesions) {
			await updateAdhesion(adh);
			await delay(150);
		}
	} catch (err) {
		console.error(err);
	}
};

runCmd()
	.then(() => console.log("END"))
	.catch(() => console.error("UNEXPECTED ERROR. TERMINATE."));
