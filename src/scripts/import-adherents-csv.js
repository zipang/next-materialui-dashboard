#!/usr/bin/env node

import csv from "fast-csv";
import APIClient from "../lib/client/ApiClient.js";
import { delay } from "../lib/utils/Promises.js";
import fs from "fs-extra";
import { getParseInstance } from "../models/ParseSDK.js";

let adhesion_counter = 110;

const nextAdhesion = () => `2021-${adhesion_counter++}`;

const convertDate = (str) => {
	const [d, m, y] = str.split("/");
	return `${y}-${m}-${d}`;
};
const convertNoAdhesion = (str) => {
	const [no, y] = str.split("-");
	if (y === "2021") {
		return [y, no].join("-");
	} else {
		return null;
	}
};
const convertRow = ({ owner, nom, siret, no_adhesion, date_debut, date_fin }, rows) => {
	const row = {
		owner,
		nom: nom.toUpperCase(),
		siret,
		no_adhesion: convertNoAdhesion(no_adhesion),
		date_debut: convertDate(date_debut),
		date_fin: convertDate(date_fin)
	};
	if (row.no_adhesion === null) {
		row.statut = "en_attente";
		row.no_adhesion = nextAdhesion();
		row.date_debut = null;
		row.date_fin = null;
	} else {
		row.statut = "active";
		if (rows.find((existing) => existing.no_adhesion === row.no_adhesion)) {
			row.no_adhesion = nextAdhesion();
		}
	}
	return row;
};

const extractAdherent = ({ nom, siret, owner, statut }) => ({
	nom,
	siret,
	owner,
	statut: statut === "active" ? "actif" : statut
});
const extractAdhesion = ({
	no_adhesion,
	nom,
	siret,
	owner,
	statut,
	date_debut,
	date_fin
}) => ({
	no: no_adhesion,
	owner,
	siret,
	nom,
	statut,
	date_debut,
	date_fin
});

const enhanceAdherent = async (row) => {
	const adherent = extractAdherent(row);
	try {
		const { siret } = adherent;
		const { siretData } = await APIClient.post("/api/siret/search", { siret });
		adherent.representant = {
			email: adherent.owner
		};
		if (siretData) {
			delete siretData.nom;
			Object.assign(adherent, siretData);
		}
		return adherent;

		// const merged = { ...siretData, ...adherent };
		// await update(merged);
	} catch (err) {
		console.error(`${err.message} on ${adherent.nom}`);
	}
};

const enhanceAdherents = async (rows) => {
	const adherents = rows.map(extractAdherent);
	for (let i = 0, len = adherents.length; i < len; i++) {
		adherents[i] = await enhanceAdherent(adherents[i]);
		await delay(300);
	}
	console.log(`Adherents `, adherents);
	return adherents;
};

const rows = [];

const importCsvData = () => {
	getParseInstance();

	return new Promise((resolve, reject) => {
		const parser = csv.parseFile("../../_assets/adherents-2021.csv", {
			headers: true
		});

		parser
			.on("error", reject)
			.on("data", (raw) => rows.push(convertRow(raw, rows)))
			.on("end", async () => {
				rows.sort((a, b) => (a.no_adhesion < b.no_adhesion ? -1 : 1));

				fs.writeFileSync(
					"../../_assets/adhesions-2021.json",
					JSON.stringify(rows.map(extractAdhesion), null, "\t")
				);

				csv.writeToPath("../../_assets/adherents-2021-corrected.csv", rows, {
					headers: true,
					quoteColumns: true
				});

				enhanceAdherents(rows).then((adherents) => {
					fs.writeFileSync(
						"../../_assets/adherents-2021.json",
						JSON.stringify(adherents, null, "\t")
					);

					resolve(true);
				});
			});
	});
};

(async () =>
	await importCsvData()
		.then(() => console.log("END"))
		.catch(console.error))();
