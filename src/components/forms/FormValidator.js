import { getProperty } from "@lib/utils/NestedObjects";
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

const buildValidationContext = ({ mode = "onSubmit" }) => {
	const fields = {};
	const errors = {};

	const register = (name, ref, validation) => {
		fields[name] = { ref, validation };
	};

	const unregister = (name) => {
		delete fields[name];
	};

	/**
	 * Do the validation of registered fields against the provided data
	 */
	const validate = (data) => {
		Object.keys(fields).forEach((fieldName) => {
			const { ref, validation } = fields[fieldName];
			const fieldValue = getProperty(data, fieldName);
			// Each key in the validation object is a validation rule
			Object.keys(validation).forEach((ruleName) => {
				try {
					const rule = validation[ruleName];
					if (ruleName === "required") {
						if (fieldValue === null || fieldValue === undefined) {
						}
					} else if (rule.pattern && typeof rule.pattern.test === "function") {
						if (!pattern.test(fieldValue)) {
						}
					} else if (typeof rule === "function") {
						if (!rule(fieldValue)) {
						}
					}
				} catch (err) {}
			});
		});
	};

	return { fields, errors, register, unregister, validate };
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
