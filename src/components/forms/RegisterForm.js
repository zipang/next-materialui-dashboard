import APIForm from "@forms/APIForm";
import Input from "@forms/Input";
import { useState } from "react";
import { Typography } from "@material-ui/core";

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
					<Input.Text
						label="Prénom"
						name="firstName"
						autoFocus={true}
						validation={{ required: "Saisissez votre prénom" }}
					/>
					<Input.Text
						label="Nom"
						name="lastName"
						validation={{ required: "Saisissez votre nom" }}
					/>
					<Input.Email
						label="Email"
						name="email"
						validation={{ required: "Saisissez votre email" }}
					/>
					<Input.Password
						label="Mot de passe"
						name="password"
						validation={{ required: "Saisissez votre mot de passe" }}
					/>
					<Input.Submit />
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
