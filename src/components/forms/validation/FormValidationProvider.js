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

	// Validation context can globally change after a call to the `validate` or `setData` methods
	// Therefore we will check to apply a state change with the result of the validate() or setData() call
	["validate", "setData"].forEach((methodName) => {
		const originalMethod = validationContext[methodName];
		// Note : be careful not to wrap the validate method multiple times
		if (!originalMethod._enhanced) {
			validationContext[methodName] = (...args) => {
				const updatedValidationContext = originalMethod(...args);
				if (updatedValidationContext !== validationContext) {
					setValidationContext(updatedValidationContext);
				}
				return updatedValidationContext;
			};
			validationContext[methodName]._enhanced = true;
		}
	});

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
