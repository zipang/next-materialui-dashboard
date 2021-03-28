import { AppBar, Avatar, Box, Grid, IconButton, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthentication } from "./AuthenticationProvider";
import { Tabs } from "./forms/tabs/TabbedView";

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

/**
 * Display the dashboard header with the logged user
 * And a serie of actions tabs
 * @param {HeaderProps} props
 */
function Header({ title, tabsDefs = [], currentTab = 0 }) {
	const { loggedUser: user } = useAuthentication();
	const styles = useStyles();

	return (
		<>
			<AppBar color="primary" position="sticky" elevation={0}>
				<Toolbar>
					<Grid container spacing={1} direction="row" justify="flex-end">
						<Box flexGrow={1}>{title && <h2>{title}</h2>}</Box>
						{user && (
							<Box alignSelf="flex-end">
								{user.firstName}&nbsp;{user.lastName}&nbsp;
								<IconButton
									color="inherit"
									className={styles.iconButtonAvatar}
								>
									<Avatar
										src="/static/images/avatar/1.jpg"
										alt={`${user.firstName} ${user.lastName}`}
									/>
								</IconButton>
							</Box>
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
				<Tabs tabsDefs={tabsDefs} currentTab={currentTab} />
			</AppBar>
		</>
	);
}

export default Header;
