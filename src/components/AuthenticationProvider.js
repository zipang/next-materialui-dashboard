import { useState, useContext, createContext, useEffect } from "react";
import { useRouter } from "next/router";
import { NoSsr } from "@material-ui/core";
import devUser from "@config/devUser.json";
import User from "@models/User";

/**
 * @typedef AuthContext
 * @property {User} loggedUser
 * @property {Function} setLoggedUser Define the logged user after a successful login
 * @property {Function} logout
 * @property {String} redirectAfterLogin Where to go after successfull login
 * @property {Function} setRedirectAfterLogin
 */
const AuthContext = createContext();

/**
 * Global Provider for the currently logged user and the way to log it out
 * NOTE : Don't forget the {children} when writing a context provider !
 * @param {PropsWithChildren} props
 * @param {User} props.user Default logged User : useful for testing. Or can be retrieved from session or local storage
 */
const AuthenticationProvider = ({ user, children }) => {
	const [loggedUser, setLoggedUser] = useState(user);
	const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

	const auth = {
		loggedUser,
		redirectAfterLogin,
		setLoggedUser,
		setRedirectAfterLogin,
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

const _DEFAULT_OPTIONS = {
	profiles: [],
	loginPage: "/login"
};

/**
 * @typedef AuthenticationOptions
 * @property {String[]} profiles check that the logged user has at least one of these profiles
 * @property {String} [loginPage="/login"] Login page if no logged user is found
 */
/**
 * Build a HOC to pass which we pass the logged user or redirect
 * @param {JSX.Element} Component
 * @param {AuthenticationOptions} options
 */
export const withAuthentication = (Component, options = _DEFAULT_OPTIONS) => ({
	...props
}) => {
	const { profiles, loginPage, redirectTo } = options;
	const { loggedUser, setLoggedUser, setRedirectAfterLogin } = useContext(AuthContext);
	const router = useRouter();

	useEffect(async () => {
		if (!loggedUser) {
			if (
				// process.env.NODE_ENV === "development" ||
				process.env.NODE_ENV === "test"
			) {
				setLoggedUser(new User(devUser));
			} else {
				// really not logged
				setRedirectAfterLogin(redirectTo || router.pathname);
				router.replace(`${loginPage}?redirect=${redirectTo || router.pathname}`);
			}
		} else if (
			profiles.length &&
			!profiles.find((profile) => loggedUser.profiles.includes(profile))
		) {
			// bad profile
			console.log(
				`Bad profile (we looked for ${profiles}). Redirect to error page`
			);
			// router.replace("/_error");
		}

		return () => {};
	}, [loggedUser]);

	return <NoSsr>{loggedUser && <Component user={loggedUser} {...props} />}</NoSsr>;
};
