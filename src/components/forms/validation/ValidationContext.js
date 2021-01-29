import { setProperty, getProperty } from "../../../lib/utils/NestedObjects.js";

const _EMPTY_ERRORS = {};
const noop = (val) => val;
const allways = (val) => () => val; // Allways return the same value
const filterByValue = (good) => (testVal) => testVal === good; // A filter that let only the 'good' values pass
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
 * Register a property
 * @param {String} name (path) to the property
 * @param {FieldDef} fieldDef
 */
const registerField = (fields, data) => (
	name,
	{ inputRef, defaultValue = null, required = false, validation = {} }
) => {
	// Store this references in our fields map
	fields[name] = { inputRef, required, validation };

	// Apply the default value if the context has no data on this property
	if (isUndefined(getProperty(data, name))) {
		setProperty(data, name, defaultValue);
	}
	// @TODO rework that
	console.log(`ValidationContext: registered field ${name}`, inputRef);
};

/**
 * Validate a value against a set of validation rules
 * @param {String} name The name of the property to validate (for error report)
 * @param {Any} value The current value of the property to validate
 * @param {String|Boolean} required If required is a string, it's the error message to return
 * @param {Object} validation Validation rules with their own keys
 */
export const validateField = (name, value, required = false, validation = {}) => {
	console.log(
		`ValidationContext: validating ${name}=${value} (required=${required})`,
		validation
	);
	if (isUndefinedOrEmpty(value)) {
		if (required) {
			throw new ValidationError(
				value,
				"required",
				typeof required === "string" ? required : `${name} is required.`
			);
		} else {
			if (!Number.isNaN(value)) {
				return true; // 'Normal' empty values are allowed and no further validation is useful
			}
		}
	}

	Object.keys(validation).forEach((ruleName) => {
		const rule = validation[ruleName];

		// What kind of validation is it (using duck typing to guess)
		if (rule.pattern && typeof rule.pattern.test === "function") {
			// Apply the regex to test the value
			if (!rule.pattern.test(value)) {
				console.log(`ValidationError : "${value}" against pattern`, rule.pattern);
				throw new ValidationError(
					value,
					ruleName,
					rule.message || `${name} has an invalid format`
				);
			}
		} else if (typeof rule === "function") {
			const test = rule(value);
			if (test !== true) {
				throw new ValidationError(
					value,
					ruleName,
					test || `${name} validation failed (${ruleName})`
				);
			}
		} else if (typeof rule?.validate === "function") {
			const test = rule.validate(value);
			if (test !== true) {
				throw new ValidationError(value, ruleName, test || rule.message);
			}
		}
	});
	return true; // It's validated !
};

const validate = (validationContext) => (name, options) => {
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

	// Check to see if we have a filter to apply
	const filterFields = typeof name === "string" ? filterByValue(name) : allways(true);

	const errors = Object.keys(fields)
		.filter(filterFields)
		.reduce((foundAnError, name) => {
			if (foundAnError !== _EMPTY_ERRORS) {
				return foundAnError; // The first encountered error is good for us
			}

			try {
				const { validation, required } = fields[name];
				validateField(name, getProperty(data, name), required, validation);
				// found an error ? nope
				return _EMPTY_ERRORS;
			} catch (err) {
				const { code, message } = err; // Extract the error parts
				const newFoundError = {}; // IMPORTANT : create a new instance
				newFoundError[name] = { code, message };
				return newFoundError;
			}
		}, _EMPTY_ERRORS);

	if (options?.onSuccess && errors === _EMPTY_ERRORS) {
		options.onSuccess(data);
	}

	if (options?.onError && errors !== _EMPTY_ERRORS) {
		options.onError(errors);
	}

	if (validationContext.errors !== errors) {
		// Return a new validationContext instance with the updated errors object
		return { ...validationContext, errors };
	} else {
		// Return the same validationContext instance
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
export const ValidationContext = (options = {}) => {
	console.log(`Building a new validation context`, options);
	const fields = {};
	const errors = _EMPTY_ERRORS; // Empty errors state will allways point to the same object instance
	const data = options.data || {};

	const register = registerField(fields, data);
	const getData = (name, defaultValue) => getProperty(data, name, defaultValue);
	const setData = (name, value) => {
		setProperty(data, name, value);
	};

	const validationContext = { fields, data, errors, register, getData, setData };
	validationContext.validate = validate(validationContext);

	return validationContext;
};

/**
 * ValidationContext methods with their final signature and proper doc
 */
ValidationContext.prototype = {
	/**
	 * Register a property
	 * @param {String} name (path) to the property
	 * @param {FieldDef} fieldDef
	 */
	register: function (name, fieldDef) {},
	/**
	 * Get the value of a property
	 * @param {String} name Path to the property
	 * @param {Any} [defaultValue]
	 * @return {Any}
	 */
	getData: function (name, defaultValue) {},
	/**
	 * Set the new value of a property
	 * @param {String} name Path to the property
	 * @param {Any} value
	 */
	setData: function (name, value) {},
	/**
	 * Validate all or just one registered fields againts their stored values
	 * @param {String} [name] Optional
	 * @param {Object} [options] expected keys for the options : `onSuccess` and `onError`
	 * @return {ValidationContext}
	 */
	validate: function (name, options) {}
};

export default ValidationContext;
