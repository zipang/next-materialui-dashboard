import { suite } from "uvu";
import { splitPath, getProperty, setProperty } from "./NestedObjects";
import { expect } from "@hapi/code";

// Define our test suite
const NestedObjectsSpec = suite("NestedObjects utils");

NestedObjectsSpec("Split a path", () => {
	expect(splitPath("")).to.be.an.empty().array();
	expect(splitPath("persons[0].address.street")).equal(
		["persons", "O", "address", "street"],
		{ deepEqual: true }
	);
});

NestedObjectsSpec.run();
