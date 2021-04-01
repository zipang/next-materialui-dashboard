import HiddenSubmit from "../inputs/HiddenSubmit.js";
import useFormStyles from "../useFormStyles.js";
import { useFormValidationContext } from "./FormValidationProvider.js";

/**
 * @typedef VFormProps
 * @property {Function<data>} onSuccess Callback called when the form validation is a success. The validated data is provided.
 * @property {Function<errors>} onError Callback called when the form validation is a failure. The errors object is provided.
 * @property {Boolean} validateOnEnter Add a hidden submit to catch the ENTER keypressed and trigger a form validation
 */

/**
 * This form MUST be used inside a <FormValidationProvider>
 * @param {VFormProps} props
 */
const VForm = ({
	onSuccess = console.log,
	onError = console.error,
	validateOnEnter = false,
	extraValidation,
	children,
	...props
}) => {
	const styles = useFormStyles();
	const { validate } = useFormValidationContext();

	/**
	 * Prevent for submission, validate the field values
	 * And then call the appropriate callback
	 * @param {DOMEvent}
	 */

	const onSubmit = (evt) => {
		evt.preventDefault();
		validate({
			extraValidation,
			onSuccess,
			onError
		});
	};

	return (
		<form onSubmit={onSubmit} className={styles.form} {...props}>
			{children}
			{validateOnEnter && <HiddenSubmit />}
		</form>
	);
};

export default VForm;
