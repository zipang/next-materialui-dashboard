import { withAuthentication } from "@components/AuthenticationProvider.js";
import Dashboard from "@components/Dashboard.js";

export default withAuthentication(Dashboard, {
	profiles: ["admin"],
	loginPage: "/admin/login",
	redirectTo: "/admin"
});
