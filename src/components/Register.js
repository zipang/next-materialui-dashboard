import { Avatar, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

import Link from "./Link.js";
import Copyright from "./Copyright.js";
import TwoColumnsFormContainer from "./TwoColumnsFormContainer.js";

import RegisterForm from "@forms/RegisterForm.js";
import { useEventBus } from "./EventBusProvider.js";

const useStyles = makeStyles((theme) => ({
	avatar: {
		margin: theme.spacing(2),
		width: theme.spacing(8),
		height: theme.spacing(8),
		backgroundColor: theme.palette.primary.main
	}
}));

const Register = ({ useEvents = true }) => {
	const styles = useStyles();
	const EventBus = useEventBus();
	const sendEvent = (eventName) => (evt) => {
		if (useEvents) {
			// Cancel page navigation and send event instead
			evt.preventDefault();
			EventBus.emit(eventName);
		}
	};

	return (
		<TwoColumnsFormContainer image="https://invie78.fr/images/background-login.jpg">
			<Avatar className={styles.avatar}>
				<AccountBoxIcon fontSize="large" />
			</Avatar>
			<Typography component="h1" variant="h5">
				Création de compte
			</Typography>
			<RegisterForm />
			<Grid container>
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
							href="/login"
							variant="caption"
							onClick={sendEvent("login")}
						>
							Se logger
						</Link>
					</Typography>
				</Grid>
				<Grid item xs={12} alignItems="center">
					<Copyright />
				</Grid>
			</Grid>
		</TwoColumnsFormContainer>
	);
};

export default Register;
