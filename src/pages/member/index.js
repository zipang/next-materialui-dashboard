import { useEffect, useState } from "react";
import { withAuthentication } from "@components/AuthenticationProvider";
import { makeStyles } from "@material-ui/core/styles";
import Header from "@components/Header";
import UserNavBar from "@components/navigation/NavigationBar";
import Copyright from "@components/Copyright";
import { useRouter } from "next/router";
import MemberAdhesionsDataTable from "@components/tables/MemberAdhesionsDataTable";
import UsersApiClient from "@lib/client/UsersApiClient";
import { withEventBus } from "@components/EventBusProvider";

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
		padding: theme.spacing(6, 4),
		background: "#eaeff1"
	},
	footer: {
		padding: theme.spacing(2),
		background: "#eaeff1"
	}
}));

export const UserDashboard = ({ user, title, tabs = [], currentTab, children }) => {
	const classes = useStyles();
	const router = useRouter();

	return (
		<div className={classes.root}>
			<nav className={classes.drawer}>
				<UserNavBar user={user} selectedNav={router.pathname} />
			</nav>
			<div className={classes.app}>
				<Header title={title} tabs={tabs} currentTab={currentTab} />
				<main className={classes.main}>{children}</main>
				<footer className={classes.footer}>
					<Copyright />
				</footer>
			</div>
		</div>
	);
};

const MemberPage = ({ user }) => {
	const router = useRouter();
	const [adhesions, setAdhesions] = useState();
	const [error, setError] = useState(false);

	useEffect(async () => {
		try {
			if (!adhesions) {
				const { rows } = await UsersApiClient.getAdhesions(user);
				if (rows.length) {
					console.log(
						`Loaded ${rows.length} adhesions for user ${user.username}`
					);
					setAdhesions(rows);
				} else {
					router.push("/member/registration");
				}
			}
		} catch (err) {
			setError(err.message);
		}
	}, [false]);

	return adhesions ? (
		<UserDashboard title="ESPACE MEMBRE INVIE" user={user}>
			<MemberAdhesionsDataTable user={user} adhesions={adhesions} />
		</UserDashboard>
	) : error ? (
		<div className="error">{error}</div>
	) : null;
};

export default withEventBus(
	withAuthentication(MemberPage, {
		profiles: ["member"],
		loginPage: "/login",
		redirectTo: "/member"
	})
);
