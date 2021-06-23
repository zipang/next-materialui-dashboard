import Sticky from "react-stickynode";
import { AppBar, Avatar, Box, Grid, IconButton, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthentication } from "./AuthenticationProvider.js";
import { Tabs } from "./forms/tabs/TabbedView.js";
import SvgIcon from "./SvgIcon.js";

const lightColor = "rgba(255, 255, 255, 0.7)";

const useStyles = makeStyles((theme) => ({
	secondaryBar: {
		zIndex: 0
	},
	userInfo: {
		marginRight: "1rem"
	},
	iconButtonAvatar: {
		"&:hover": {
			color: theme.palette.common.black
		}
	},
	link: {
		textDecoration: "none",
		color: lightColor,
		"&:hover": {}
	},
	button: {
		borderColor: lightColor
	}
}));

/**
 * Display the dashboard header with the logged user
 * And a serie of actions tabs
 * @param {HeaderProps} props
 */
function Header({ title, tabsDefs = [], currentTab = 0 }) {
	const { loggedUser: user, logout } = useAuthentication();
	const styles = useStyles();

	return (
		<Sticky enabled={true} innerZ={999}>
			<AppBar color="primary" elevation={0}>
				<Toolbar>
					<Grid container spacing={1} direction="row" justify="flex-end">
						<Box flexGrow={1}>{title && <h2>{title}</h2>}</Box>
						{user && (
							<Box alignSelf="flex-end" className={styles.userInfo}>
								{user.firstName}&nbsp;{user.lastName}&nbsp;
								<IconButton
									edge="end"
									className={styles.iconButtonAvatar}
									onClick={logout}
								>
									<Avatar title="Déconnexion">
										<SvgIcon name="LogOut" />
									</Avatar>
								</IconButton>
							</Box>
						)}
					</Grid>
				</Toolbar>
				<Tabs tabsDefs={tabsDefs} currentTab={currentTab} />
			</AppBar>
		</Sticky>
	);
}

export default Header;
