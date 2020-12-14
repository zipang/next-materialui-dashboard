import { useState, useContext, createContext } from "react";

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
