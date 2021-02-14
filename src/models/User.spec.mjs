import { suite } from "uvu";
import code from "@hapi/code";
import User from "./User.js";
import { loadEnv } from "../lib/utils/Env.js";

const { expect } = code;
const UserTestSuite = suite("User");

loadEnv(); // needed to retrieve the Parse environment variables

const testUser1 = {
	username: "1234",
	password: "password",
	email: "user@back4app.test"
};
const testUser2 = {
	username: "zipang",
	password: "iwonttellu",
	email: "christophe.desguez@gmail.com",
	firstName: "Christophe",
	lastName: "Desguez"
};

UserTestSuite.before(() => {});

UserTestSuite("User.register() can create a new user", async () => {
	const newUser = await User.register({ username: "jojo", password: "jojo" });
	console.log(
		`Logged user: ${newUser.get("username")} ${newUser.get(
			"firstName"
		)} ${newUser.get("lastName")}, email: ${newUser.get("email")}`
	);
});

UserTestSuite("User.login() can retrieve an existing user", async () => {
	const jojo = await User.logIn({ username: "jojo", password: "jojo" });
	console.log(
		`Logged user: ${jojo.get("username")} ${jojo.get("firstName")} ${jojo.get(
			"lastName"
		)}, email: ${jojo.get("email")}`
	);
});

// UserTestSuite.run(); // not ready for prime time
