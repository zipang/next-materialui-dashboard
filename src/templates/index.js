const cache = {};

/**
 * Return a registered template function by its name
 * @param {String} name
 * @return {Function}
 */
export const getTemplate = async (name) => {
	let template = cache[name];

	if (!template) {
		try {
			const templateModule = await import(`./${name}.js`);
			template = cache[name] = templateModule.default; // the default export which is the render function
		} catch (err) {
			console.error(err);
			throw new ApiError(404, `Unknown mail template ${name}. ${err.message}`);
		}
	}

	return template;
};

export default cache;
