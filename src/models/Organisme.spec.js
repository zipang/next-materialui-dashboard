import { suite } from "uvu";
import Organisme from "./Organisme.js";
import code from "@hapi/code";

const { expect } = code;

const OrganismeTestSuite = suite("Organismes model");

OrganismeTestSuite("Create a new Organisme", () => {});

OrganismeTestSuite.run();
