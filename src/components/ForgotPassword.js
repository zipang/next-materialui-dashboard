import { Avatar, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ContactMailIcon from "@material-ui/icons/ContactMail";

import Link from "./Link";
import Copyright from "./Copyright";
import TwoColumnsFormContainer from "./TwoColumnsFormContainer";

import ForgotPasswordForm from "@forms/ForgotPasswordForm";
import { useEventBus } from "./EventBusProvider";

const useStyles = makeStyles((theme) => ({
	avatar: {
		margin: theme.spacing(2),
		width: theme.spacing(10),
		height: theme.spacing(10),
		backgroundColor: theme.palette.primary.dark
	}
}));

const ForgotPassword = () => {
	const styles = useStyles();
	const EventBus = useEventBus();
	const sendEvent = (eventName) => (e) => {
		EventBus.emit(eventName);
	};

	return (
		<TwoColumnsFormContainer image="https://images.unsplash.com/photo-1518559162837-912467e0c48f?auto=format&fit=crop&w=800&q=80">
			<Avatar className={styles.avatar}>
				<ContactMailIcon fontSize="large" />
			</Avatar>
			<Typography component="h1" variant="h5">
				Mot de passe oublié
			</Typography>
			<Typography component="p">
				Saisissez votre adresse mail. Nous vous enverrons un lien pour
				réinitialiser votre mot de passe.
			</Typography>

			<ForgotPasswordForm />
			<Grid container>
				<Grid item xs={12} sm={6}>
					<Link href="#" variant="caption" onClick={sendEvent("login")}>
						Se connecter
					</Link>
				</Grid>
				<Grid item xs={6} sm={6}>
					<Typography align="right">
						<Link href="#" variant="caption" onClick={sendEvent("register")}>
							Créer un compte
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

export default ForgotPassword;
