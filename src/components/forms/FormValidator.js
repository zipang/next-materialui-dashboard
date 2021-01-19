import { Name } from "quicktype/dist/quicktype-core";
import { useContext, createContext } from "react";

const FormValidatorContext = createContext();

/**
 * @typedef ValidationContext
 * @param {Function<Name, ref, validation>} register Register a field by its name
 * @param {Function<Name>} unregister Unregister a field by its name
 * @param {Function} validate Function to validate the current form data
 * @param {Object} errors
 */

/**
 * Provide the form validator context
 * @param {ValidationContext} props
 */
export const FormValidatorProvider = ({ ...validationContext }) => (
	<FormValidatorContext value={validationContext}>{children}</FormValidatorContext>
);

export const useFormValidationContext = () => {
	const validationContext = useContext(FormValidatorContext);
	if (!validationContext) {
		throw new Error(
			`useFormValidationContext() hook can only be used from inside a <FormValidatorProvider> parent`
		);
	}
	return validationContext;
};

/**
 *
 * @param {ValidationContextOptions} options
 */
export const withFormValidationContext = (Component, options) => ({ ...props }) => {
	const [validationContext, setValidationContext] = useState(
		buildValidationContext(options)
	);

	return (
		<FormValidatorContext.Provider value={validationContext}>
			<Component {...props} />
		</FormValidatorContext.Provider>
	);
};
