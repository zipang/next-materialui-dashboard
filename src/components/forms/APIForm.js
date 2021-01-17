import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import APIClient from "@lib/client/ApiClient";
import { CircularProgress } from "@material-ui/core";
import useFormStyles from "./useFormStyles";

/**
 * Automatically submit validated form data to the API
 * The APIForm will take care of the inputs validation before submitting to the API
 * @param props
 * @param {string} props.action API method URL to submit to
 * @param {string} [props.method=POST] the HTTP verb to use
 * @param {JSX.Element} props.children the real form content (fields and submit button)
 * @param {Function} [props.onSubmit] an optional method to call before form submission. RETURNING false will cancel the submission
 * @param {Function} [props.onSuccess] an optional method to call when the form submission has been a success
 * @param {Function} [props.onError] an optional method to call only when the API returned an error
 */
const APIForm = ({ action, method = "POST", onSubmit, onSuccess, onError, children }) => {
	const styles = useFormStyles();
	const formMethods = useForm();
	const [submitting, setSubmitting] = useState(false);

	/**
	 * Submit the form data
	 * @see https://react-hook-form.com/api/#handleSubmit
	 */
	const handleSubmit = formMethods.handleSubmit(async (formData, e) => {
		if (!formData || !e.preventDefault) return; // prevent weird recursion
		e.preventDefault();

		try {
			const validation = typeof onSubmit === "function" ? onSubmit(formData) : true;

			if (validation) {
				console.dir(`Sending : `, JSON.stringify(formData));
				setSubmitting(true);
				const apiResponse = await APIClient.post(action, formData);
				if (typeof onSuccess === "function") {
					onSuccess(apiResponse);
				}
			} else {
				console.dir(`Form submission cancelled : `, JSON.stringify(formData));
			}
		} catch (err) {
			// Display API error
			if (typeof onError === "function") {
				onError(err.message);
			} else {
				alert(`API Form ${err.message}`);
			}
		}
		setSubmitting(false);
	});

	return (
		<FormProvider {...formMethods}>
			{!submitting && (
				<form
					action={action}
					method={method}
					className={styles.form}
					onSubmit={handleSubmit}
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
