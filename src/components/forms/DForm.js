import { useEventBus } from "@components/EventBusProvider";
import { flattenErrors } from "./errors";
import { useForm, FormProvider } from "react-hook-form";

import useFormStyles from "./useFormStyles";

/**
 * Disconnected Form that doesn't need a submit button
 * @param props
 * @param {JSX.Element} props.children the real form content (fields and submit button)
 * @param {String} props.formId Unique id to communicat with the form through events
 * @param {Function} props.onSubmit method to call on form submission.
 * @param {Function} props.onErrors optional method to call on form validation errors.
 */
const DForm = ({
	formId = "form",
	data = {},
	mode = "onSubmit",
	onSubmit,
	onErrors,
	children
}) => {
	const styles = useFormStyles();
	const { handleSubmit, ...formMethods } = useForm({
		defaultValues: data,
		reValidateMode: "onChange",
		mode
	});
	const eb = useEventBus();

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

	// Listen to the event `form:validate`
	// and trigger a form submit
	eb &&
		eb.on(
			`${formId}:validate`,
			handleSubmit(
				handleSuccess, // no error : we can send the data
				handleErrors
			)
		);

	return (
		<FormProvider {...formMethods}>
			<form
				id={formId}
				onSubmit={handleSubmit(handleSuccess, handleErrors)}
				className={styles.form}
			>
				{children}
			</form>
		</FormProvider>
	);
};

export default DForm;
