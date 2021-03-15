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
			template = await import(`./${name}.js`);
		} catch (err) {
			console.error(err);
			throw new ApiError(404, `Unknown mail template ${name}. ${err.message}`);
		}
	}

	return template;
};

export default cache;
