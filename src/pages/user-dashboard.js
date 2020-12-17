import { withAuthentication } from "@components/AuthenticationProvider";
import { makeStyles } from "@material-ui/core/styles";
import Header from "@components/Header";
import UserNavBar from "@components/navigation/NavigationBar";
import Copyright from "@components/Copyright";

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
		flexDirection: "column"
	},
	main: {
		flex: 1,
		padding: theme.spacing(6, 4),
		background: "#eaeff1"
	},
	footer: {
		padding: theme.spacing(2),
		background: "#eaeff1"
	}
}));

/**
 * Layout du tableau de bord des membres adhérents
 * @param {PropsWithChildren} props
 */
function UserDashboard({ user }) {
	const classes = useStyles();

	if (!user) return null;

	return (
		<div className={classes.root}>
			<nav className={classes.drawer}>
				<UserNavBar user={user} />
			</nav>
			<div className={classes.app}>
				<Header />
				<main className={classes.main}></main>
				<footer className={classes.footer}>
					<Copyright />
				</footer>
			</div>
		</div>
	);
}

export default withAuthentication(UserDashboard, {
	profiles: ["adherent"],
	redirectTo: "/"
});
