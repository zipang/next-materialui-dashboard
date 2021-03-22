import { setProperty, getProperty } from "../../../lib/utils/NestedObjects.js";

const _EMPTY_ERRORS = {};
export const noop = (val) => val;
export const allways = (val) => () => val; // Allways return the same value
export const filterByValue = (good) => (testVal) => testVal === good; // A filter that let only the 'good' values pass
export const isUndefined = (val) =>
	val === undefined || val === null || Number.isNaN(val);
export const isUndefinedOrEmpty = (val) => val === "" || isUndefined(val);

/**
 * Dedicated error
 */
export class ValidationError extends TypeError {
	constructor(value, code, message) {
		super(message);
		this.value = value;
		this.code = code;
	}
	toString() {
		return message;
	}
}

/**
 * @typedef {Object} FieldDef Holds a reference to an input and its validation rules
 * @property {inputRef} Reference to set focus on field when validation fails
 * @property {Any} [defaultValue] The default value if not set by the context
 * @property {Boolean} [required=false]
 * @property {Object} validation rules
 */

/**
 * @typedef {FieldRegistrationFunction}
 * @property {String} name (path) to the property
 * @property {FieldDef} fieldDef
 */

/**
 * Build the field registration function
 * @param {Object} fields Map of the fields indexed by their property path (eg : "user.name")
 * @param {Object} data
 * @returns {FieldRegistrationFunction}
 */
const registerField = (fields, data) => (
	name,
	{ inputRef, defaultValue = null, required = false, disabled = false, validation = {} }
) => {
	// Store these references in our fields map
	fields[name] = { inputRef, required, validation };

	// Check to see if this field must be refreshed when external data changes
	if (typeof required === "function" || typeof disabled === "function") {
		fields._needsRefreshAfterDataChange = true;
	}

	let currentValue = getProperty(data, name);

	// Apply the default value if the context has no existing data for this property
	if (isUndefined(currentValue)) {
		setProperty(data, name, (currentValue = defaultValue));
	}

	console.log(
		`Registering field '${name}', required: ${required}, ${Object.keys(
			validation
		)}, value: '${currentValue}'`,
		inputRef
	);
};

/**
 * Validate a value against a set of validation rules
 * @param {String} name The name of the property to validate (for error report)
 * @param {Any} value The current value of the property to validate
 * @param {Function|String|Boolean} required If required is a string, it's the error message to return
 * @param {Object} validation Validation rules with their own keys
 * @param {Object} data The whole data object in the validation context
 */
export const validateField = (name, value, required = false, validation = {}, data) => {
	// First thing first : is this value required ?
	if (isUndefinedOrEmpty(value)) {
		const isValueRequired =
			typeof required === "function" ? required(data) : required;
		if (isValueRequired) {
			throw new ValidationError(
				value,
				"required",
				typeof isValueRequired === "string" ? isValueRequired : `Required field.`
			);
		} else {
			if (!Number.isNaN(value)) {
				return true; // 'Normal' empty values are allowed and no further validation is useful
			}
		}
	}

	// Then the other validation rules
	Object.keys(validation).forEach((ruleId) => {
		const rule = validation[ruleId];

		// What kind of validation is it (using duck typing to guess)
		if (rule.pattern && typeof rule.pattern.test === "function") {
			// Apply the regex to test the value
			if (!rule.pattern.test(value)) {
				console.log(`ValidationError : "${value}" against pattern`, rule.pattern);
				throw new ValidationError(
					value,
					ruleId,
					rule.message || `${name} has an invalid format`
				);
			}
		} else if (typeof rule === "function") {
			const test = rule(value, data);
			if (test !== true) {
				throw new ValidationError(
					value,
					ruleId,
					test || `${name} validation failed (${ruleId})`
				);
			}
		} else if (typeof rule?.validate === "function") {
			const test = rule.validate(value, data);
			if (test !== true) {
				throw new ValidationError(value, ruleId, test || rule.message);
			}
		}
	});

	return true; // It's validated !
};

/**
 * Validate the whole data against more validation rules who acts globally
 * @param {Object} [validation] Additional validation rules with their own keys
 * @param {Object} data The whole data object in the validation context
 */
export const doExtraValidation = (validation = {}, data) => {
	// Then the other validation rules
	Object.keys(validation).forEach((ruleId) => {
		const validationRule = validation[ruleId];

		if (typeof validationRule === "function") {
			const test = validationRule(data);
			if (test !== true && Array.isArray(test)) {
				throw new ValidationError(
					test[0], // Here is in fact the name of the field where to put the message or 'global'
					ruleId,
					test[1] || `Extra validation failed (${ruleId})`
				);
			}
		} else if (typeof validationRule?.validate === "function") {
			const test = validationRule.validate(data);
			if (test !== true) {
				const { name, message } = test; // these test return must return a field name or 'global'
				throw new ValidationError(name, ruleId, test || message);
			}
		}
	});

	return true; // It's validated !
};

/**
 * Build the validate function
 * @param {ValidationContext} validationContext
 * @return {Function} Validate a single property or the whole registered fields in the context
 */
const buildValidate = (validationContext) => (name, options = {}) => {
	// Extract what we need
	const { fields, data } = validationContext;

	if (name?.onSuccess || name?.onError) {
		// name is in fact the options object
		options = name;
		name = null;
	}

	if (typeof name === "string" && fields[name] === undefined) {
		return {
			unregistered: `Property ${name} is not registered and therefore cannot be validated`
		};
	}

	if (name === null) {
		console.log(`validate() called on registered fields ${Object.keys(fields)}`);
	}

	// Check to see if we have a filter to apply
	const validateASingleField = typeof name === "string";
	const filterFields = validateASingleField ? filterByValue(name) : allways(true);

	// Here is the real validation happening :
	// We loop over all the field names that have been registered
	let errors = Object.keys(fields)
		.filter(filterFields)
		.reduce((foundAnError, name) => {
			if (foundAnError !== _EMPTY_ERRORS) {
				return foundAnError; // The first encountered error is good for us
			}

			try {
				const { validation, required } = fields[name];
				validateField(name, getProperty(data, name), required, validation, data);
				// found an error ? nope
				return _EMPTY_ERRORS;
			} catch (err) {
				const { code, message } = err; // Extract the error parts
				const newFoundError = {}; // IMPORTANT : create a new instance
				newFoundError[name] = { code, message };
				fields[name].inputRef?.current?.focus();
				return newFoundError;
			}
		}, _EMPTY_ERRORS);

	// And now for the last (optional) validation step that comes after each
	// field has successfully passed their own validation rules
	const { extraValidation, onSuccess, onError } = options;

	if (errors === _EMPTY_ERRORS && extraValidation) {
		try {
			doExtraValidation(extraValidation, data);
		} catch (err) {
			const { value, code, message } = err; // Extract the error parts
			errors = {}; // IMPORTANT : create a new instance
			errors[value] = { code, message };
			if (value in fields) fields[value].inputRef?.current?.focus();
		}
	}

	// Do we have some callback to call ?
	if (onSuccess && errors === _EMPTY_ERRORS) {
		onSuccess(data);
	}

	if (onError && errors !== _EMPTY_ERRORS) {
		onError(errors);
	}

	if (validateASingleField || validationContext.errors !== errors) {
		console.log(`Validation errors have been raised.`, errors);
		// Return a new validationContext instance with the updated errors object
		// => WILL re-render all the registered fields
		return { ...validationContext, errors };
	} else {
		// Return the SAME validationContext instance
		// => will NOT re-render all the fields
		return validationContext;
	}
};

/**
 * @typedef ValidationContextOptions
 * @param {Object} [data={}] load pre-existing data
 */

/**
 *
 * @param {ValidationContextOptions} options
 * @return {ValidationContext}
 */
export const createValidationContext = (options = {}) => {
	console.log(`Building a new validation context`, options);

	const fields = {};
	const errors = _EMPTY_ERRORS; // Empty errors state will allways point to the same object instance
	const data = options.data || {};

	const register = registerField(fields, data);
	const getData = (name, defaultValue) => getProperty(data, name, defaultValue);

	const validationContext = { fields, data, errors, register, getData };

	// And now.. for the methods that can have side-effects on the ValidationContext instance
	validationContext.validate = buildValidate(validationContext);

	validationContext.setData = (name, value) => {
		setProperty(data, name, value);
		if (fields._needsRefreshAfterDataChange) {
			return { ...validationContext }; // return a new instance
		} else {
			return validationContext;
		}
	};

	validationContext.setError = (name, error) => {
		const errors = {}; // Create a new instance
		errors[name] = error;
		return { ...validationContext, errors }; // return a new instance
	};

	return validationContext;
};

/**
 * Represent the current state of validation of a set of properties
 * with their type and validation rules
 * And the current data and errors
 */
class ValidationContext {
	/**
	 * The current Map of property names, value
	 */
	data = {};

	/**
	 *
	 */
	errors = {};

	/**
	 *
	 */
	fields = {};

	/**
	 * Register a property
	 * @param {String} name (path) to the property
	 * @param {FieldDef} fieldDef
	 */
	register(name, fieldDef) {}

	/**
	 * Get the value of a property
	 * @param {String} name Path to the property
	 * @param {Any} [defaultValue]
	 * @return {Any}
	 */
	getData(name, defaultValue) {}

	/**
	 * Set the new value of a property
	 * @param {String} name Path to the property
	 * @param {Any} value
	 */
	setData(name, value) {}

	/**
	 * Validate all or just one registered fields againts their stored values
	 * @param {String} [name] Optional
	 * @param {Object} [options] expected keys for the options : `onSuccess` and `onError`
	 * @return {ValidationContext}
	 */
	validate(name, options) {}
}

export default ValidationContext;
