import { useEffect } from "react";
import { useEventBus } from "@components/EventBusProvider";
import { flattenErrors } from "./errors";
import { useForm, FormProvider } from "react-hook-form";

import useFormStyles from "./useFormStyles";

/**
 * @typedef StepFormProps
 * @field {String!} formId Unique id : required to communicate with the form through events
 * @field {Object} data Object to populate the form with their initial values
 * @field {String} [mode=onSubmit] Auto-validation mode, same values as react-form-hooks mode
 * @field {Function} onSubmit method to call on form submission.
 * @field {Function} onErrors optional method to call on form validation errors.
 * @field {JSX.Element} children the real form content (fields and submit button)
 */

/**
 * StepForm
 * A piece of a bigger Form that doesn't need have its own submit button or action
 * We can trigger the form validation by sending the custom event `formId:validate`
 * If it succeeds, data is received inside the `onSubmit` callback
 * If it fails, errors are retrieved inside the `onErrors` callback
 * @param {StepFormProps} props
 */
const StepForm = ({
	formId = "form",
	data = {},
	mode = "onSubmit",
	onSubmit,
	onErrors,
	children
}) => {
	const eb = useEventBus();
	const styles = useFormStyles();

	// @see https://react-hook-form.com/api/#handleSubmit
	const { handleSubmit, ...formMethods } = useForm({
		defaultValues: data,
		reValidateMode: "onChange",
		shouldFocusError: true,
		mode
	});

	/**
	 * Called when the form validation is a success
	 * @param {Object} formData
	 */
	const handleSuccess = (formData) => {
		if (typeof onSubmit === "function") {
			onSubmit(formData);
		} else {
			console.dir(
				`Receiving form data for ${formId}`,
				JSON.stringify(formData, null, "\t")
			);
			eb && eb.emit(`${formId}:submit`, formData);
		}
	};
	/**
	 * Called when the form validation is a failure
	 * @see https://react-hook-form.com/api#errors
	 * @param {Object} errors
	 */
	const handleErrors = (errors) => {
		if (typeof onErrors === "function") {
			onErrors(flattenErrors(errors));
		} else {
			console.log(
				`Validation of ${formId} triggered errors`,
				JSON.stringify(flattenErrors(errors), null, "\t")
			);
			eb && eb.emit(`${formId}:errors`, errors);
		}
	};

	const validateForm = handleSubmit(
		handleSuccess, // no error : we can send the data
		handleErrors
	);

	/**
	 * Validate on ENTER
	 * @param {Event} e
	 */
	const onKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			validateForm();
		}
	};

	useEffect(() => {
		if (eb) {
			// Listen to the event `form:validate`
			// and trigger a form submit
			eb.on(`${formId}:validate`, validateForm);
			return () => eb.off(`${formId}:validate`, validateForm); // Clean on unmount
		}
	}, [eb]);

	return (
		<FormProvider {...formMethods}>
			<form
				id={formId}
				onSubmit={validateForm}
				onKeyPress={onKeyPress}
				className={styles.form}
			>
				{children}
			</form>
		</FormProvider>
	);
};

export default StepForm;
