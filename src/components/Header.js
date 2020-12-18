import {
	AppBar,
	Avatar,
	Grid,
	Hidden,
	IconButton,
	Tab,
	Tabs,
	Toolbar,
	Tooltip
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { makeStyles } from "@material-ui/core/styles";

import { useAuthentication } from "./AuthenticationProvider";
import EventBusProvider, { useEventBus } from "./EventBusProvider";

const lightColor = "rgba(255, 255, 255, 0.7)";

const useStyles = makeStyles((theme) => ({
	secondaryBar: {
		zIndex: 0
	},
	iconButtonAvatar: {
		padding: 4
	},
	link: {
		textDecoration: "none",
		color: lightColor,
		"&:hover": {
			color: theme.palette.common.white
		}
	},
	button: {
		borderColor: lightColor
	}
}));

const MenuButton = () => {
	const EventBus = useEventBus();
	<Hidden smUp>
		<Grid item>
			<IconButton
				color="inherit"
				aria-label="open drawer"
				onClick={() => EventBus.emit("toggleMenu")}
				edge="start"
			>
				<MenuIcon />
			</IconButton>
		</Grid>
	</Hidden>;
};

function Header() {
	const { loggedUser: user } = useAuthentication();
	const styles = useStyles();

	return (
		<>
			<AppBar color="primary" position="sticky" elevation={0}>
				<Toolbar>
					<Grid container spacing={1} alignItems="center">
						{user && (
							<>
								<Grid item>
									{user.firstName} {user.lastName}
								</Grid>
								<Grid item>
									<Tooltip title="Alerts • No alerts">
										<IconButton color="inherit">
											<NotificationsIcon />
										</IconButton>
									</Tooltip>
								</Grid>
								<Grid item>
									<IconButton
										color="inherit"
										className={styles.iconButtonAvatar}
									>
										<Avatar
											src="/static/images/avatar/1.jpg"
											alt={`${user.firstName} ${user.lastName}`}
										/>
									</IconButton>
								</Grid>
							</>
						)}
					</Grid>
				</Toolbar>
			</AppBar>

			<AppBar
				component="div"
				className={styles.secondaryBar}
				position="static"
				elevation={0}
			>
				<Tabs value={0} textColor="inherit">
					<Tab label="Recherche" />
					<Tab label="Membres actifs" />
					<Tab label="Paiements en attente" />
					<Tab label="Membres inactifs" />
				</Tabs>
			</AppBar>
		</>
	);
}

export default Header;
