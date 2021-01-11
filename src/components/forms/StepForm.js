import { useEffect, useLayoutEffect, useState } from "react";
import { useEventBus } from "@components/EventBusProvider";
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
	data,
	mode = "onSubmit",
	onSubmit,
	onErrors,
	children
}) => {
	const eb = useEventBus();
	const styles = useFormStyles();
	const [firstMount, setFirstMount] = useState(true);

	// @see https://react-hook-form.com/api/#handleSubmit
	const { ...formMethods } = useForm({
		defaultValues: data,
		reValidateMode: "onSubmit",
		shouldFocusError: true,
		shouldUnregister: true,
		criteriaMode: "firstError",
		mode
	});
	const { handleSubmit, reset, clearErrors } = formMethods;

	/**
	 * Called when the form validation is a success
	 * @param {Object} formData
	 */
	const handleSuccess = (formData) => {
		console.dir(
			`Receiving form data for ${formId}`,
			JSON.stringify(formData, null, "\t")
		);
		if (typeof onSubmit === "function") {
			onSubmit(formData);
		} else {
			eb && eb.emit(`${formId}:submit`, formData);
		}
	};

	/**
	 * Called when the form validation is a failure
	 * @see https://react-hook-form.com/api#errors
	 * @param {Object} errors
	 */
	const handleErrors = (errors) => {
		console.log(`Validation of ${formId} triggered errors`, errors);
		const firstError = Object.keys(errors)[0];
		// We only want the first error
		Object.keys(errors).forEach((fieldName) => {
			if (fieldName !== firstError) delete errors[fieldName];
		});
		//errors[firstError].ref.current.focus();
		if (typeof onErrors === "function") {
			onErrors(errors);
		} else {
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
		console.log(
			`${firstMount ? "" : "Re-"}Rendering form ${formId} with data`,
			JSON.stringify(data, null, "\t")
		);
		// Listen to the event `form:validate`
		if (eb && firstMount) {
			clearErrors();
			eb.on(`${formId}:validate`, () => {
				console.log("Received ${formId}:validate event");
				validateForm();
			});
			setFirstMount(false);
		} else {
			reset(data); // form default values are cached after the first mount so we have to reset them when navigating between steps
		}
		return () => {
			console.log(`Cleaning form ${formId} events`);
			eb && eb.off(`${formId}:validate`, validateForm); // Clean on unmount
		};
	}, [data]);

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
