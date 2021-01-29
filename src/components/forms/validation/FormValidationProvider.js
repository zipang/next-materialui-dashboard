import { useState, useContext, createContext } from "react";
import ValidationContext from "./ValidationContext";

const FormValidatorContext = createContext();

/**
 * Provide the form validation context to children
 * IMPORTANT : Calling validate() will trigger a re-render if the validationState changes
 * @param {PropsWithChildren} props
 * @param {ValidationContextOptions} [props.options]
 */
export const FormValidationProvider = ({ children, ...options }) => {
	// Store the initial validationContext state
	const [validationContext, setValidationContext] = useState(
		ValidationContext(options)
	);

	// Validation context can change after a call to the `validate` method
	// Therefore we automatically apply a state change with the result of the validate() call
	const _validate = validationContext.validate;
	if (!_validate._enhanced) {
		// Note : be careful not to wrap the validate method multiple times
		validationContext.validate = (...args) => {
			const updatedValidationContext = _validate(...args);
			setValidationContext(updatedValidationContext);
			return updatedValidationContext;
		};
		validationContext.validate._enhanced = true;
	}

	return (
		<FormValidatorContext.Provider value={validationContext}>
			{children}
		</FormValidatorContext.Provider>
	);
};

/**
 * Hook to retrieve the parent Form ValidationContext
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
 * HOC : Wrap a component inside a Form Validation Context provider
 * @param {JSXElementConstructor} Component
 * @param {ValidationContextOptions} options like `initialValues`
 * @param {Props} initialProps Pass these to the wrapped component (he can receive more)
 */
export const withFormValidationContext = (Component, options = {}, initialProps) => ({
	...props
}) => {
	return (
		<FormValidationProvider options={options}>
			<Component {...initialProps} {...props} />
		</FormValidationProvider>
	);
};
