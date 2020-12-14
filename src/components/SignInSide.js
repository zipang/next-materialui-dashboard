import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Link from "./Link";
import Copyright from "./Copyright";
import { makeStyles } from "@material-ui/core/styles";
import LoginForm from "./forms/LoginForm";

const useStyles = makeStyles((theme) => ({
	twocolumns: {
		flexGrow: 1,
		height: "100%",
		width: "100%",
		margin: 0,
		padding: 0
	},
	image: {
		display: "flex",
		height: "100%",
		width: "90%",
		flexDirection: "row",
		backgroundImage:
			"url(https://images.unsplash.com/photo-1505663912202-ac22d4cb3707?auto=format&fit=crop&w=800&q=80)",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		backgroundPosition: "right"
	},
	form: {
		margin: theme.spacing(8, 4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	avatar: {
		margin: theme.spacing(2),
		width: theme.spacing(8),
		height: theme.spacing(8),
		backgroundColor: theme.palette.secondary.main
	}
}));

export default function SignInSide() {
	const styles = useStyles();

	return (
		<Grid container>
			<Grid item xs={false} lg={7} className={styles.image}></Grid>
			<Grid item xs={12} lg={5} className={styles.form}>
				<Avatar className={styles.avatar}>
					<LockOutlinedIcon fontSize="large" />
				</Avatar>
				<Typography component="h1" variant="h5">
					Connexion
				</Typography>
				<LoginForm />
				<Grid container>
					<Grid item xs={12} sm={6}>
						<Link href="#" variant="caption">
							Mot de passe oublié ?
						</Link>
					</Grid>
					<Grid item xs={6} sm={6}>
						<Typography align="right">
							<Link href="#" variant="caption" align="right">
								Créer mon compte
							</Link>
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Copyright />
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
