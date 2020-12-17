import { useRouter } from "next/router";
import { useAuthentication } from "../AuthenticationProvider";

import APIForm from "@forms/APIForm";
import Input from "@forms/Input";
import User from "@models/User";

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
			<Input.Email
				label="Email"
				name="username"
				autoFocus={true}
				validation={{ required: "Saisissez votre email" }}
			/>
			<Input.Password
				label="Mot de passe"
				name="password"
				validation={{ required: "Saisissez votre mot de passe" }}
			/>
			<Input.Submit />
		</APIForm>
	);
};

export default LoginForm;
