import { useState, useGlobal } from "reactn";
import { useRouter } from "next/router";
import LoadingSpinner from "../../components/LoadingSpinner";

import User from "../models/User";
import PageForbidden from "../../pages/forbidden";

/**
 * Verify that a page is only accessible when a user is logged
 * And when the user has the required roles
 * @param {PageComponent} Page
 * @param {Array} [roles=[]] - check that the user has at least one of these this roles to access the page
 */
const withAuth = (Page) => (props, roles = []) => {
	const router = useRouter();
	const [user, setUser] = useGlobal("loggedUser");
	const [initialProps, setInitialProps] = useState(false);

	if (user) {
		console.log(`withAuth() : We found the user, checking permissions ${Page}....`);

		if (roles.length && !User.hasRoles(roles)) {
			return PageForbidden({ user });
		}

		if (Page.getInitialProps) {
			console.log("withAuth() : ....With initial props....!");
			Page.getInitialProps().then(setInitialProps).catch(console.error);

			// it will rerender when initial props will be loaded
			return initialProps ? (
				Page({ user, ...props, ...initialProps })
			) : (
				<LoadingSpinner />
			);
		} else {
			return Page({ user, ...props });
		}
	}

	// (In dev mode only : autolog)
	// const settings = getSettings();
	// if (settings.autolog && router && router.pathname === "/") {
	// 	getUser(settings.autolog.userId)
	// 		.then((user) => {
	// 			console.log(`Autolog user ${user.firstName} ${user.lastName}`);
	// 			setUser(user);
	// 			router.push(settings.autolog.page);
	// 		})
	// 		.catch((err) => {
	// 			console.error(err);
	// 			router.push(`/login?redirect=${router.pathname}`);
	// 		});
	// }

	//console.log(`checkAuth(): checking authentication for page ${Page}:  User not found`);

	if (typeof document !== "undefined") {
		console.log("Redirect to login page");
		router.push(`/login?redirect=${router.pathname}`);
	}
	return null;
};

export default withAuth;
