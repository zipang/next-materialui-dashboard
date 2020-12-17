import { useState, useContext, createContext, useEffect } from "react";
import { useRouter } from "next/router";
import User from "@models/User";

const AuthContext = createContext();

/**
 * NOTE : Don't forget the {children} when writing a context provider !
 */
const AuthenticationProvider = ({ children }) => {
	const [loggedUser, setLoggedUser] = useState(null);

	const auth = {
		loggedUser,
		setLoggedUser,
		logout: () => setLoggedUser(null)
	};

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthenticationProvider;

/**
 * useAuthentication() Hook
 * @return {AuthContext}
 */
export const useAuthentication = () => {
	const auth = useContext(AuthContext);
	if (!auth) {
		throw new Error(
			`useAuthentication() hook can only be used from inside a <AuthenticationProvider/> parent`
		);
	}
	return auth;
};

/**
 * @typedef AuthenticationOptions
 * @field {String[]} profiles check that the logged user has at least one of these profiles
 * @param {String} [redirectTo="/"] path to redirect if no logged user is found
 */
/**
 * Build a HOC to pass which we pass the logged user or redirect
 * @param {JSX.Element} Component
 * @param {AuthenticationOptions} options
 */
export const withAuthentication = (Component, { profiles = [], redirectTo = "/" }) => ({
	...props
}) => {
	const { loggedUser } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		if (!loggedUser) {
			// not logged
			console.log(`No logged user. Redirect to ${redirectTo}`);
			router.replace(redirectTo);
		} else if (
			profiles.length &&
			!profiles.find((profile) => loggedUser.profiles.includes(profile))
		) {
			// bad profile
			console.log(
				`Bad profile (we looked for ${profiles}). Redirect to ${redirectTo}`
			);
			router.replace(redirectTo);
		}

		return () => {};
	}, [loggedUser]);

	if (typeof window === "undefined") {
		console.log("No SSR");
		return null;
	} else {
		return <Component user={loggedUser} {...props} />;
	}
};
