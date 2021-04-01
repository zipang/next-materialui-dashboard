import { Avatar, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Link from "./Link.js";
import Copyright from "./Copyright.js";
import TwoColumnsFormContainer from "./TwoColumnsFormContainer.js";

import LoginForm from "@forms/LoginForm.js";
import { useEventBus } from "./EventBusProvider.js";

const useStyles = makeStyles((theme) => ({
	avatar: {
		margin: theme.spacing(2),
		width: theme.spacing(8),
		height: theme.spacing(8),
		backgroundColor: theme.palette.secondary.main
	}
}));

const Login = ({ admin = false, useEvents = true }) => {
	const styles = useStyles();
	const EventBus = useEventBus();
	const sendEvent = (eventName) => (evt) => {
		if (useEvents) {
			// Cancel page navigation and send event to the listeners instead
			evt.preventDefault();
			EventBus.emit(eventName);
		}
	};

	return (
		<TwoColumnsFormContainer image="https://invie78.fr/images/background-login.jpg">
			<Avatar className={styles.avatar}>
				<LockOutlinedIcon fontSize="large" />
			</Avatar>
			<Typography component="h1" variant="h5">
				Connexion
			</Typography>
			<LoginForm admin={admin} />
			<Grid container>
				{admin && (
					<Grid item xs={12}>
						<Typography align="center">
							<Link
								href="/admin/forgot-password"
								variant="caption"
								onClick={sendEvent("forgotPassword")}
							>
								Mot de passe oublié ?
							</Link>
						</Typography>
					</Grid>
				)}
				{!admin && (
					<>
						<Grid item xs={12} sm={6}>
							<Link
								href="/forgot-password"
								variant="caption"
								onClick={sendEvent("forgotPassword")}
							>
								Mot de passe oublié ?
							</Link>
						</Grid>
						<Grid item xs={6} sm={6}>
							<Typography align="right">
								<Link
									href="/create-account"
									variant="caption"
									onClick={sendEvent("register")}
								>
									Créer mon compte
								</Link>
							</Typography>
						</Grid>
					</>
				)}
				<Grid item xs={12}>
					<Copyright />
				</Grid>
			</Grid>
		</TwoColumnsFormContainer>
	);
};

export default Login;
