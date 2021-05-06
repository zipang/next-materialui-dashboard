// adhesions_report.js
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
	var out = "A la date du " + getProperty(data, "today", "") + "\n\n";
	if (getProperty(data, "a_renouveler.length", "")) {
		out += "\nListe des adhérents ayant leur adhésion à renouveler dans un mois :\n";
	}
	out += "\n";
	var arr1 = data.a_renouveler;
	if (arr1) {
		var adhesion,
			i1 = -1,
			l1 = arr1.length - 1;
		while (i1 < l1) {
			adhesion = arr1[(i1 += 1)];
			out += "\n * " + adhesion + "\n";
		}
	}
	out += "\n\n";
	if (getProperty(data, "closed.length", "")) {
		out += "\nListe des adhérents ayant terminé leur adhésion :\n";
	}
	out += "\n";
	var arr2 = data.closed;
	if (arr2) {
		var adhesion,
			i2 = -1,
			l2 = arr2.length - 1;
		while (i2 < l2) {
			adhesion = arr2[(i2 += 1)];
			out += "\n * " + adhesion + "\n";
		}
	}
	out += "\n\n";
	return out.replace(/(<([^>]+)>)/gi, "");
};

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = function anonymous(data) {
	var out = "<p>A la date du " + getProperty(data, "today", "") + "</p><p>";
	if (getProperty(data, "a_renouveler.length", "")) {
		out += "Liste des adhérents ayant leur adhésion à renouveler dans un mois :";
	}
	var arr1 = data.a_renouveler;
	if (arr1) {
		var adhesion,
			i1 = -1,
			l1 = arr1.length - 1;
		while (i1 < l1) {
			adhesion = arr1[(i1 += 1)];
			out += "</p><ul><li>" + adhesion + "</li></ul><p>";
		}
	}
	out += "</p><p>";
	if (getProperty(data, "closed.length", "")) {
		out += "Liste des adhérents ayant terminé leur adhésion :";
	}
	var arr2 = data.closed;
	if (arr2) {
		var adhesion,
			i2 = -1,
			l2 = arr2.length - 1;
		while (i2 < l2) {
			adhesion = arr2[(i2 += 1)];
			out += "</p><ul><li>" + adhesion + "</li></ul><p>";
		}
	}
	out += "</p>";
	return out;
};

/**
 * Front matter subject
 * @param {Object} data
 * @return {String}
 */
export const subject = function anonymous(data) {
	var out =
		"Rapport des adhésions INVIE à renouveler le " + getProperty(data, "today", "");
	return out;
};

/**
 * Front matter to
 * @param {Object} data
 * @return {String}
 */
export const to = function anonymous(data) {
	var out = "" + getProperty(data, "env.MAIL_CONTACT", "");
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

const adhesions_report = {
	text,
	html,
	subject,
	to,
	bcc
};

const render = (data) =>
	Object.keys(adhesions_report).reduce((prev, key) => {
		prev[key] = adhesions_report[key](data);
		return prev;
	}, {});

export default render;
