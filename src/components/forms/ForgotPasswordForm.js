import APIForm from "@forms/APIForm.js";
import { useState } from "react";
import { Typography } from "@material-ui/core";
import Email from "./inputs/Email.js";
import Submit from "./inputs/Submit.js";

/**
 * Displays the form to help the user recover his password
 */
const ForgotPasswordForm = () => {
	const [submitted, setSubmitted] = useState(false);

	return (
		<>
			{!submitted && (
				<APIForm
					action="/api/user/forgotPassword"
					onSuccess={() => setSubmitted(true)}
				>
					<Email label="Email" name="email" required="Saisissez votre email" />
					<Submit />
				</APIForm>
			)}
			{submitted && <Typography>Regardez votre boîte aux lettres.</Typography>}
		</>
	);
};

export default ForgotPasswordForm;
