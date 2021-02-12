import welcome from "./welcome.js";
import attestation from "./attestation.js";

const templates = {
	welcome,
	attestation
};

console.log("Loaded templates", templates);

/**
 * Return a registered template function by its name
 * @param {String} name
 * @return {Function}
 */
export const getTemplate = (name) => {
	const template = templates[name];

	if (!template) {
		throw new ApiError(404, `Unknown mail template ${name}`);
	}
	return template;
};

export default templates;
