import APIForm from "@forms/APIForm.js";
import { useState } from "react";
import { Typography } from "@material-ui/core";
import Text from "./inputs/Text.js";
import Email from "./inputs/Email.js";
import Password from "./inputs/Password.js";
import Submit from "./inputs/Submit.js";

/**
 * Displays the first form to create a new user
 * @param props
 * @param {Function] props.onRegistration What to do when the registration first step is successfull
 */
const RegisterForm = ({ onRegistration }) => {
	const [submitted, setSubmitted] = useState(false);
	return (
		<>
			{!submitted && (
				<APIForm action="/api/user/register" onSuccess={() => setSubmitted(true)}>
					<Text
						label="Prénom"
						name="firstName"
						autoFocus={true}
						required="Saisissez votre prénom"
					/>
					<Text label="Nom" name="lastName" required="Saisissez votre nom" />
					<Email label="Email" name="email" required="Saisissez votre email" />
					<Password
						label="Mot de passe"
						name="password"
						required="Saisissez votre mot de passe"
					/>
					<Submit />
				</APIForm>
			)}
			{submitted && (
				<Typography variant="body2">
					Regardez votre boîte aux lettres. Un email de vérification vient de
					vous être envoyé.
				</Typography>
			)}
		</>
	);
};

export default RegisterForm;
