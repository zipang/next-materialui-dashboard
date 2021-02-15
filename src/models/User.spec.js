import { suite } from "uvu";
import code from "@hapi/code";
import User from "./User.js";
import { getParseInstance } from "./ParseSDK.js";
import testUser from "./test-user.js";

const { expect } = code;
const UserTestSuite = suite("User");

let Parse;

UserTestSuite.before(() => {
	Parse = getParseInstance();
});

UserTestSuite("User.register() can create a new user", async () => {
	const newUser = await User.register(testUser);
	console.log(
		`Logged user: ${newUser.get("username")} ${newUser.get(
			"firstName"
		)} ${newUser.get("lastName")}, email: ${newUser.get("email")}`
	);
});

UserTestSuite("User.login() can retrieve an existing user", async () => {
	const testUser = await User.logIn(testUser);
	console.log(testUser);
});

UserTestSuite.run(); // not ready for prime time
