import { useState, useContext, createContext } from "react";
import ValidationContext from "./ValidationContext";

const FormValidatorContext = createContext();

/**
 * @typedef ValidationContext
 * @property {Function<name, inputRef, validation>} register Register a field by its name
 * @property {Function} validate Function to validate the current form data or a single field
 * @property {Object} [data={}]
 * @property {Object} [errors={}]
 */

/**
 * Provide the form validator context
 * @param {ValidationContext} props
 */
export const FormValidationProvider = ({ children, options = {} }) => {
	const [validationContext, setValidationContext] = useState(
		ValidationContext(options)
	);
	const _validate = validationContext.validate;
	validationContext.validate = (...args) => {
		setValidationContext(_validate(...args));
	};

	return (
		<FormValidatorContext.Provider value={validationContext}>
			{children}
		</FormValidatorContext.Provider>
	);
};

/**
 * @return {ValidationContext}
 */
export const useFormValidationContext = () => {
	const validationContext = useContext(FormValidatorContext);
	if (!validationContext) {
		throw new Error(
			`useFormValidationContext() hook can only be used from inside a <FormValidationProvider> parent`
		);
	}
	return validationContext;
};

/**
 *
 * @param {ValidationContextOptions} options
 */
export const withFormValidationContext = (Component, options = {}) => ({ ...props }) => {
	return (
		<FormValidationProvider options={options}>
			<Component {...props} />
		</FormValidationProvider>
	);
};
