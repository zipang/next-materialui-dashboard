import { Avatar, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Link from "./Link.js";
import Copyright from "./Copyright.js";

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

const Login = () => {
	const styles = useStyles();
	const EventBus = useEventBus();
	const sendEvent = (eventName) => (e) => {
		EventBus.emit(eventName);
	};

	return (
		<Grid container direction="row" justify="center" alignItems="center">
			<Avatar className={styles.avatar}>
				<LockOutlinedIcon fontSize="large" />
			</Avatar>
			<Typography component="h1" variant="h5">
				Connexion
			</Typography>
			<LoginForm />
			<Grid container>
				<Grid item xs={12} sm={6}>
					<Link
						href="#"
						variant="caption"
						onClick={sendEvent("forgotPassword")}
					>
						Mot de passe oublié ?
					</Link>
				</Grid>
				<Grid item xs={12}>
					<Copyright />
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Login;
