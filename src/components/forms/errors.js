export const flattenErrors = (errors) => {
	return Object.keys(errors).reduce((flattened, fieldName) => {
		const { type, message } = errors[fieldName];
		flattened[fieldName] = { type, message };
		return flattened;
	}, {});
};
