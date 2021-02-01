import useFormStyles from "../useFormStyles";
import { useFormValidationContext } from "./FormValidationProvider";

/**
 * @typedef VFormProps
 * @param {Function<data>} onSuccess Callback called when the form validation is a success. The validated data is provided.
 * @param {Function<errors>} onError Callback called when the form validation is a failure. The errors object is provided.
 */

/**
 * This form MUST be used inside a <FormValidationProvider>
 * @param {VFormProps} props
 */
export const VForm = ({
	onSuccess = console.log,
	onError = console.error,
	children,
	...props
}) => {
	const styles = useFormStyles();
	const { validate } = useFormValidationContext();

	// Just log what's goin on when submitting
	const onSubmit = (evt) => {
		evt.preventDefault();
		validate({
			onSuccess,
			onError
		});
	};

	return (
		<form onSubmit={onSubmit} className={styles.form} {...props}>
			{children}
			<input type="submit" className="hidden" aria-hidden="true" />
		</form>
	);
};
