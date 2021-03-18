import { useState, useContext, createContext } from "react";
import { createValidationContext } from "./ValidationContext";

const FormValidationContext = createContext();

/**
 * Provide the form validation context to children
 * IMPORTANT : Calling validate() will trigger a re-render if the validationState changes
 * @param {PropsWithChildren} props
 * @param {ValidationContextOptions} [props.options]
 */
export const FormValidationProvider = ({ children, ...options }) => {
	// Store the initial validationContext state
	const [validationContext, setValidationContext] = useState(
		createValidationContext(options)
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
		<FormValidationContext.Provider value={validationContext}>
			{children}
		</FormValidationContext.Provider>
	);
};

/**
 * Hook to retrieve the parent Form ValidationContext
 * @return {ValidationContext}
 */
export const useFormValidationContext = () => {
	const validationContext = useContext(FormValidationContext);
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
