import { useState } from "react";
import useFormStyles from "./useFormStyles.js";
import APIClient from "@lib/client/ApiClient.js";
import { CircularProgress } from "@material-ui/core";
import {
	FormValidationProvider,
	useFormValidationContext
} from "./validation/FormValidationProvider.js";
import Center from "@components/Center.js";

/**
 * @typedef APIFormProps
 * @property {String} action local URL of an API page
 * @property {Function<FormData>} [onSubmit] optional function to handle the form data submission
 * @property {onSuccess} [onSuccess] optional function to handle the successfull API response
 * @property {onError} [onError] optional function to handle the failed API response
 */
/**
 * @param {APIFormProps} props
 */
const VAPIForm = ({
	action,
	method = "POST",
	onSubmit,
	onSuccess,
	onError,
	children,
	customStyles = {}
}) => {
	const styles = useFormStyles(customStyles);
	const [submitting, setSubmitting] = useState(false);

	const { validate } = useFormValidationContext();

	/**
	 * Submit the form data to the API when it is validated
	 */
	const onValidationSuccess = async (formData) => {
		try {
			console.dir(`Sending form data to API : `, JSON.stringify(formData));
			setSubmitting(true);
			const apiResponse = await APIClient.post(action, formData);
			if (typeof onSuccess === "function") {
				onSuccess(apiResponse);
			}
		} catch (err) {
			if (typeof onError === "function") {
				// return API error to provided callback
				onError(err);
			} else {
				// or display it
				alert(`API Form ${err.message}`);
			}
		}
		setSubmitting(false);
	};

	// Validate before submitting to the API
	const handleValidation = (evt) => {
		evt.preventDefault();
		validate({
			onSuccess: onSubmit || onValidationSuccess
		});
	};

	return (
		<>
			{!submitting && (
				<form
					action={action}
					method={method}
					className={styles.form}
					onSubmit={handleValidation}
				>
					{children}
				</form>
			)}
			{submitting && (
				<div className={styles.form}>
					<Center>
						<CircularProgress />
					</Center>
				</div>
			)}
		</>
	);
};

/**
 * Automatically submit validated form data to the API
 * The APIForm will take care of the inputs validation before submitting to the API
 * @param apiFormProps
 * @param {string} apiFormProps.action API method URL to submit to
 * @param {string} [apiFormProps.method=POST] the HTTP verb to use
 * @param {JSX.Element} apiFormProps.children the real form content (fields and submit button)
 * @param {Function} [apiFormProps.onSuccess] an optional method to call when the form submission has been a success
 * @param {Function} [apiFormProps.onError] an optional method to call only when the API returned an error
 */
const APIForm = ({ children, ...apiFormProps }) => (
	<FormValidationProvider>
		<VAPIForm {...apiFormProps}>{children}</VAPIForm>
	</FormValidationProvider>
);
export default APIForm;
