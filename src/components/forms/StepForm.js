import { useEffect, useLayoutEffect, useState } from "react";
import { useEventBus } from "@components/EventBusProvider";
import { useForm, FormProvider } from "react-hook-form";

import useFormStyles from "./useFormStyles";
import Input from "@forms/Input";
import { isAssetError } from "next/dist/client/route-loader";
import { getProperty } from "@lib/utils/NestedObjects";

/**
 * Errors is now a hierarchical object
 * @param {*} errors
 */
const getFirstError = (errors) => {
	const errorPath = [];
	let start = errors;

	do {
		const firstKey = Object.keys(start)[0];
		start = start[firstKey];
		errorPath.push(firstKey);
	} while (!(start?.ref && start?.message));
	return errorPath.join(".");
};

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
	validateOnEnter = true,
	onSubmit,
	onErrors,
	customStyles = {},
	children
}) => {
	const eb = useEventBus();
	const styles = useFormStyles(customStyles);

	// Keep track of the fields composing this step
	const [step, setStep] = useState({});

	// @see https://react-hook-form.com/api/#handleSubmit
	const { ...formMethods } = useForm({
		defaultValues: data,
		reValidateMode: "onSubmit",
		shouldFocusError: true,
		shouldUnregister: true,
		criteriaMode: "firstError",
		mode
	});
	const {
		handleSubmit,
		errors,
		reset,
		clearErrors,
		setError,
		register,
		unregister
	} = formMethods;

	/**
	 * Called when the form validation is a success
	 * @param {Object} formData
	 */
	const handleSuccess = (formData) => {
		console.dir(
			`Receiving form data for ${formId}`,
			JSON.stringify(formData, null, "\t"),
			errors
		);
		if (typeof onSubmit === "function") {
			onSubmit(formData, errors);
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
		const firstError = getFirstError(errors);
		// We only want the first error
		errors = getProperty(errors, firstError);
		console.log("Trimmed to first error", firstError, errors);
		clearErrors();
		step[firstError].current?.focus();
		setError(firstError, errors);
		if (typeof onErrors === "function") {
			onErrors(errors);
		} else {
			eb && eb.emit(`${formId}:errors`, errors);
		}
	};

	const validate = handleSubmit(handleSuccess, handleErrors);

	const registerField = ({ name, ref, validation }) => {
		if (!step[name]) {
			console.log(`Registering field ${name} in step ${formId}`);
			register(name, validation);
			step[name] = ref;
		}
	};

	/**
	 * Validate on ENTER on goto next step
	 * @param {Event} e
	 */
	// const validateOnEnter = (e) => {
	// 	if (e.key === "Enter" && !e.shiftKey) {
	// 		console.log(`${formId} received ENTER keypress`);
	// 		validate();
	// 	}
	// };
	// let onKeyPress = noop;

	useEffect(() => {
		console.log(
			`Rendering form ${formId} with data`,
			JSON.stringify(data, null, "\t")
		);
		setStep({});
		reset(data); // form default values are cached after the first mount so we have to reset them when navigating between steps
		clearErrors();
		// onKeyPress = validateOnEnter;
		// Listen to the event `form:validate`
		if (eb) {
			eb.on(`${formId}:validate`, validate);
			eb.on(`${formId}:register`, registerField);
		}
		return () => {
			console.log(`Unmounting form ${formId}`);
			// onKeyPress = noop;
			if (eb) {
				// Clean up event handlers
				eb.off(`${formId}:validate`, validate);
				eb.off(`${formId}:register`, registerField);
			}
			// Unregister each field tied to this step
			Object.keys(step).forEach((name) => {
				console.log(`Unregistering field ${name}`);
				unregister(name);
				// delete step[name];
			});
		};
	}, [formId]);

	return (
		<FormProvider
			{...formMethods}
			formId={formId}
			registerField={registerField}
			validate={validate}
		>
			<form
				id={formId}
				onSubmit={validate}
				// onKeyPress={onKeyPress}
				className={styles.form}
			>
				{children}
				{validateOnEnter && <Input.HiddenSubmit />}
			</form>
		</FormProvider>
	);
};

export default StepForm;
