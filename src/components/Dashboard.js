import { makeStyles } from "@material-ui/core/styles";
import Header from "@components/Header.js";
import UserNavBar from "@components/navigation/NavigationBar.js";
import Copyright from "@components/Copyright.js";
import { useRouter } from "next/router";
import { useAuthentication } from "./AuthenticationProvider.js";

const drawerWidth = 256;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		minHeight: "100vh"
	},
	drawer: {
		[theme.breakpoints.up("sm")]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	app: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		overflow: "hidden"
	},
	main: {
		flex: 1,
		padding: "7rem 1rem 1rem",
		background: "#eaeff1",
		"& .action": {
			// The floating action button
			position: "absolute",
			right: "2rem",
			bottom: "4rem"
		}
	},
	footer: {
		padding: theme.spacing(2),
		background: "#eaeff1"
	}
}));

const Dashboard = ({ title, tabsDefs = [], currentTab, children }) => {
	const classes = useStyles();
	const router = useRouter();
	const { loggedUser } = useAuthentication();

	return loggedUser ? (
		<div className={classes.root}>
			<nav className={classes.drawer}>
				<UserNavBar user={loggedUser} selectedNav={router.pathname} />
			</nav>
			<div className={classes.app}>
				<Header title={title} tabsDefs={tabsDefs} currentTab={currentTab} />
				<main className={classes.main}>{children}</main>
				<footer className={classes.footer}>
					<Copyright />
				</footer>
			</div>
		</div>
	) : (
		<strong>Forbidden. You must be logged to see this page.</strong>
	);
};

export default Dashboard;
