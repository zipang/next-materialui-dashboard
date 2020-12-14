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

	const onSubmit = async (formData, e) => {
		e.preventDefault();

		try {
			const response = await APIClient.post("/api/user/forgotPassword", formData);
			// Call the registration callbak
			if (response.success) {
				setSubmitted(true);
			} else {
				alert(response.message);
			}
		} catch (err) {
			// API error
			alert(err.message);
		}
	};

	return (
		<>
			{!submitted && (
				<APIForm action="/api/user/forgotPassword" onSubmit={onSubmit}>
					<Input.Email
						label="Email"
						name="email"
						validation={{ required: "Saisissez votre email" }}
					/>
					<Input.Submit />
				</APIForm>
			)}
			{submitted && <Typography>Regardez votre boîte aux lettres</Typography>}
		</>
	);
};

export default ForgotPasswordForm;
