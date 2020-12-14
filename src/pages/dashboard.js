import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import Header from "@components/Header";
import Navigator from "@components/Navigator";
import SearchBox from "@components/SearchBox";
import Copyright from "@components/Copyright";
import { useAuthentication } from "@components/AuthenticationProvider";

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

function Dashboard(props) {
	const auth = useAuthentication();
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<div className={classes.root}>
			<nav className={classes.drawer}>
				<Hidden smUp implementation="js">
					<Navigator
						PaperProps={{ style: { width: drawerWidth } }}
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
					/>
				</Hidden>
				<Hidden smDown implementation="css">
					<Navigator PaperProps={{ style: { width: drawerWidth } }} />
				</Hidden>
			</nav>
			<div className={classes.app}>
				<Header onDrawerToggle={handleDrawerToggle} />
				<main className={classes.main}>
					<SearchBox />
				</main>
				<footer className={classes.footer}>
					<Copyright />
				</footer>
			</div>
		</div>
	);
}

Dashboard.propTypes = {};

export default Dashboard;
