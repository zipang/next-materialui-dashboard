import { useEffect } from "react";
import { useEventBus } from "@components/EventBusProvider";
import useFormStyles from "@forms/useFormStyles";
import {
	FormValidationProvider,
	useFormValidationContext
} from "@forms/validation/FormValidationProvider";
import VForm from "@forms/validation/VForm";

/**
 * @typedef StepFormProps
 * @property {String!} formId Unique id : required to communicate with the form through events
 * @property {Object} data Object to populate the form with their initial values
 * @property {Function} onSubmit method to call on form submission.
 * @property {JSX.Element} children the real form content (fields and submit button)
 */

/**
 * StepForm
 * A piece of a bigger Form that doesn't need have its own submit button or action
 * We can trigger the form validation by sending the custom event `${formId}:validate`
 * If it succeeds, data is received inside the `onSubmit` callback
 * If it fails, errors are retrieved inside the `onErrors` callback
 * @param {StepFormProps} props
 */
const VStepForm = ({
	formId = "form",
	onSubmit,
	onError,
	validateOnEnter = true,
	customStyles = {},
	children
}) => {
	const eb = useEventBus();
	const styles = useFormStyles(customStyles);
	const { validate } = useFormValidationContext();

	/**
	 * Called when the form validation is a success
	 * @param {Object} formData
	 */
	const onSuccess = (formData) => {
		console.dir(
			`Receiving data for step ${formId}`,
			JSON.stringify(formData, null, "\t")
		);
		if (typeof onSubmit === "function") {
			onSubmit(formData);
		} else {
			eb && eb.emit(`${formId}:submit`, formData);
		}
	};

	// Call onSuccess if the validation is a success
	const validateStep = () => validate({ onSuccess, onError });

	useEffect(() => {
		// Listen to the event `form:validate`
		if (eb) {
			eb.on(`${formId}:validate`, validateStep);
		}
		return () => {
			console.log(`Unmounting form ${formId}`);
			// onKeyPress = noop;
			if (eb) {
				// Clean up event handlers
				eb.off(`${formId}:validate`, validateStep);
			}
		};
	}, [formId]);

	return (
		<VForm
			id={formId}
			onSuccess={onSuccess}
			onError={onError}
			className={styles.form}
			validateOnEnter={validateOnEnter}
		>
			{children}
		</VForm>
	);
};

const StepForm = ({ data, ...props }) => (
	<FormValidationProvider data={data}>
		<VStepForm {...props} />
	</FormValidationProvider>
);
export default StepForm;
