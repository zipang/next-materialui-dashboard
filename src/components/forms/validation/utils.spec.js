import { suite } from "uvu";
import { expect } from "@hapi/code";

import { formatInteger, formatIntegerWithUnit } from "./utils.js";

const UtilsTestSuite = suite("Validation utils");

UtilsTestSuite("Format Integers", () => {
	expect(formatInteger(" ")("9")).to.equal("9");
	expect(formatInteger("")("9")).to.equal("9");
	expect(formatInteger(" ")("9999")).to.equal("9 999");
});

UtilsTestSuite("Format Integers with a unit", () => {
	expect(formatIntegerWithUnit(" ", "€")("9")).equal(["9", "€"]);
	expect(formatIntegerWithUnit("", "€")("9")).to.equal(["9", "€"]);
	expect(formatIntegerWithUnit(" ", "j/H")("9999")).to.equal(["9 999", "j/H"]);
});

UtilsTestSuite.run();
