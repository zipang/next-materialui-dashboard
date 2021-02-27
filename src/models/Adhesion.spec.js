import { suite } from "uvu";
import { getParseInstance } from "./ParseSDK.js";
import code from "@hapi/code";

const { expect } = code;

import { adhesion_en_attente } from "./adhesion-test.js";

let Parse;

const AdhesionTestSuite = suite("Adhesions model");

AdhesionTestSuite.before(() => {
	console.log(`getParseInstance()`);
	Parse = getParseInstance();
});

AdhesionTestSuite("Get the next adhesion number", async () => {
	const currentYear = new Date().getFullYear().toString();
	const no = await Parse.Adhesion.getNextNumber();

	expect(no).to.be.a.string();

	// Split adhesion number
	const [year, counter] = no.split("-");
	expect(year).to.equal(currentYear);
});

AdhesionTestSuite("Create a new Adhesion", async () => {
	const adh = await Parse.Adhesion.create(adhesion_en_attente);

	console.log(adh.toJSON());
	expect(adh.createdAt).to.be.a.date();
});

AdhesionTestSuite("Retrieve current adhesions", async () => {
	const adhesions = await Parse.Adhesion.getAll();

	expect(adhesions).to.be.an.array();

	adhesions.forEach((adh) => expect(adh.no.length).to.equal(8));
});

export default AdhesionTestSuite;
