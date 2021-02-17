import { useRouter } from "next/router";
import { useAuthentication } from "../AuthenticationProvider";

import APIForm from "@forms/APIForm";
import User from "@models/User";
import Email from "./inputs/Email";
import Password from "./inputs/Password";
import Submit from "./inputs/Submit";

/**
 * Displays a form to log the user
 */
const LoginForm = () => {
	const auth = useAuthentication();
	const router = useRouter();

	/**
	 * After a successful login, the full User is returned by the API
	 * @param {Object} userData
	 */
	const onSuccess = (userData) => {
		auth.setLoggedUser(new User(userData));

		if (auth.redirectAfterLogin) {
			// We know where the disconnected user wanted to be
			router.push(auth.redirectAfterLogin);
		} else {
			router.push("/user-dashboard");
		}
	};

	return (
		<APIForm action="/api/user/login" onSuccess={onSuccess}>
			<Email
				label="Email"
				name="username"
				autoFocus={true}
				required="Saisissez votre email"
			/>
			<Password
				label="Mot de passe"
				name="password"
				required="Saisissez votre mot de passe"
			/>
			<Submit />
		</APIForm>
	);
};

export default LoginForm;
