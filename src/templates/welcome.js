// welcome.js
const splitPath = (path = "") => path.split(/[,\[\]\.]+?/).filter(Boolean);

/**
 * Extract the property value at the designed path
 * @example getProperty({ person: { firstName: "John" }}, "person.firstName", "")
 * @param {Object} source Object to extract the property from
 * @param {String} path Usings dots and [] to access sub properties
 * @param {Object} [defaultValue] what to return if the property is not found (undefined)
 * @return {Any}
 */
const getProperty = (source = {}, path = "", defaultValue) => {
	const result = splitPath(path).reduce(
		(result, key) => (result !== null && result !== undefined ? result[key] : result),
		source
	);

	return result === undefined || result === null || result === source
		? defaultValue
		: result;
};

/**
 * Apply the data to the compiled TEXT template
 * @param {Object} data
 * @return {String}
 */
export const text = function anonymous(data) {
	var out =
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" />\n\nParis, le ' +
		new Date().toISOString().substr(0, 10) +
		"\n\nBonjour **" +
		getProperty(data, "representant.prenom", "") +
		" " +
		getProperty(data, "representant.nom", "") +
		"**,\n\nL'enregistrement de votre société **" +
		getProperty(data, "nom", "") +
		"** a bien été pris en compte en date du " +
		getProperty(data, "date_creation", "") +
		".\n\n";
	return out.replace(/(<([^>]+)>)/gi, "");
};

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = function anonymous(data) {
	var out =
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" /><p>Paris, le ' +
		new Date().toISOString().substr(0, 10) +
		"</p><p>Bonjour <strong>" +
		getProperty(data, "representant.prenom", "") +
		" " +
		getProperty(data, "representant.nom", "") +
		"</strong>,</p><p>L'enregistrement de votre société <strong>" +
		getProperty(data, "nom", "") +
		"</strong> a bien été pris en compte en date du " +
		getProperty(data, "date_creation", "") +
		".</p>";
	return out;
};

/**
 * Front matter subject
 * @param {Object} data
 * @return {String}
 */
export const subject = function anonymous(data) {
	var out = "L'enregistrement de " + getProperty(data, "nom", "") + " a bien été reçu";
	return out;
};

/**
 * Front matter to
 * @param {Object} data
 * @return {String}
 */
export const to = function anonymous(data) {
	var out =
		'"' +
		getProperty(data, "representant.prenom", "") +
		" " +
		getProperty(data, "representant.nom", "") +
		'" <' +
		getProperty(data, "representant.email", "") +
		">";
	return out;
};

/**
 * Front matter bcc
 * @param {Object} data
 * @return {String}
 */
export const bcc = function anonymous(data) {
	var out = "zipang <christophe.desguez@gmail.com>";
	return out;
};

/**
 * Front matter attachments
 * @param {Object} data
 * @return {String}
 */
export const attachments = function anonymous(data) {
	var out = "attestation";
	return out;
};

const welcome = {
	text,
	html,
	subject,
	to,
	bcc,
	attachments
};

const render = (data) =>
	Object.keys(welcome).reduce((prev, key) => {
		prev[key] = welcome[key](data);
		return prev;
	}, {});

export default render;
