import { useForm, FormProvider } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import APIClient from "@lib/client/ApiClient";
import { CircularProgress } from "@material-ui/core";

/**
 * Create specific css class names for our form
 */
const useStyles = makeStyles((theme) => ({
	form: {
		height: "100%",
		width: "100%",
		marginTop: theme.spacing(1),
		alignItems: "center",
		justify: "center",
		"& input": {
			fontWeight: 800
		},
		"& .submit": {
			margin: theme.spacing(3, 0, 2)
		}
	}
}));

/**
 * Automatically submit validated form data to the API
 * The APIForm will take care of the inputs validation before submitting to the API
 * @param props
 * @param {string} props.action API method URL to submit to
 * @param {string} [props.method=POST] the HTTP verb to use
 * @param {JSX.Element} props.children the real form content (fields and submit button)
 * @param {Function} [props.onSuccess] an optional method to call when the form submission has been a success
 */
const APIForm = ({ action, method = "POST", onSuccess, children }) => {
	const styles = useStyles();
	const formMethods = useForm();
	const [submitting, setSubmitting] = useState(false);

	/**
	 * Submit the form data
	 * @see https://react-hook-form.com/api/#handleSubmit
	 */
	const onSubmit = formMethods.handleSubmit(async (formData, e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const apiResponse = await APIClient.post(action, formData);
			if (typeof onSuccess === "function") {
				onSuccess(apiResponse);
			}
		} catch (err) {
			// Display API error
			alert(err.message);
			setSubmitting(false);
		}
	});

	return (
		<FormProvider {...formMethods}>
			{!submitting && (
				<form
					action={action}
					method={method}
					className={styles.form}
					onSubmit={onSubmit}
				>
					{children}
				</form>
			)}
			{submitting && (
				<div className={styles.form}>
					<CircularProgress />
					<p>Submitting...</p>
				</div>
			)}
		</FormProvider>
	);
};

export default APIForm;
