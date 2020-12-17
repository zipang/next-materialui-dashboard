import APIClient from "@lib/client/ApiClient";
import APIForm from "@forms/APIForm";
import Input from "@forms/Input";
import { useState } from "react";
import { Typography } from "@material-ui/core";

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
					<Input.Email
						label="Email"
						name="email"
						validation={{ required: "Saisissez votre email" }}
					/>
					<Input.Submit />
				</APIForm>
			)}
			{submitted && <Typography>Regardez votre boîte aux lettres.</Typography>}
		</>
	);
};

export default ForgotPasswordForm;
