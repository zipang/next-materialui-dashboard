import { useRouter } from "next/router";
import { useAuthentication } from "../AuthenticationProvider";

import APIForm from "@forms/APIForm";
import Input from "@forms/inputs/Input";
import User from "@models/User";
import Email from "./inputs/Email";
import Password from "./inputs/Password";

/**
 * Displays a form to log the user
 */
const LoginForm = () => {
	const authProvider = useAuthentication();
	const router = useRouter();

	/**
	 * After a successful login, the full User is returned by the API
	 * @param {Object} userData
	 */
	const onSuccess = (userData) => {
		authProvider.setLoggedUser(new User(userData));
		// Do a fast client-side transition to the already prefetched dashboard page
		router.push("/user-dashboard");
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
			<Input.Submit />
		</APIForm>
	);
};

export default LoginForm;
