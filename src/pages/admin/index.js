import { withAuthentication } from "@components/AuthenticationProvider";
import Dashboard from "@components/Dashboard";

export default withAuthentication(Dashboard, {
	profiles: ["admin"],
	loginPage: "/admin/login",
	redirectTo: "/admin"
});
