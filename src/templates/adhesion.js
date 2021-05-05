// adhesion.js
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
		"" +
		getProperty(data, "nom", "") +
		" vient d'adhérer/renouveler son adhésion.\n\nLes coordonnées :\n\n**" +
		getProperty(data, "nom", "") +
		"**  \n" +
		getProperty(data, "adresse.rue1", "") +
		"  \n" +
		getProperty(data, "adresse.rue2", "") +
		"  \n" +
		getProperty(data, "adresse.code_postal", "") +
		" " +
		getProperty(data, "adresse.commune", "") +
		"  \n\nStandard: " +
		getProperty(data, "contact.telephone", "") +
		"  \nEmail: " +
		getProperty(data, "contact.email", "") +
		"\n\nReprésentant " +
		getProperty(data, "representant.prenom", "") +
		" " +
		getProperty(data, "representant.nom", "") +
		".\nEmail: " +
		getProperty(data, "representant.email", "") +
		"\nN° Mobile: " +
		getProperty(data, "representant.mobile", "") +
		"\n\n";
	if (getProperty(data, "demande_contact_adherent", "")) {
		out += "\n**La structure a souhaité être recontactée**\n";
	}
	out += "\n";
	return out.replace(/(<([^>]+)>)/gi, "");
};

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = function anonymous(data) {
	var out =
		"<p>" +
		getProperty(data, "nom", "") +
		" vient d'adhérer/renouveler son adhésion.</p><p>Les coordonnées :</p><p><strong>" +
		getProperty(data, "nom", "") +
		"</strong><br />" +
		getProperty(data, "adresse.rue1", "") +
		"<br />" +
		getProperty(data, "adresse.rue2", "") +
		"<br />" +
		getProperty(data, "adresse.code_postal", "") +
		" " +
		getProperty(data, "adresse.commune", "") +
		"</p><p>Standard: " +
		getProperty(data, "contact.telephone", "") +
		"<br />Email: " +
		getProperty(data, "contact.email", "") +
		"</p><p>Représentant " +
		getProperty(data, "representant.prenom", "") +
		" " +
		getProperty(data, "representant.nom", "") +
		".Email: " +
		getProperty(data, "representant.email", "") +
		"N° Mobile: " +
		getProperty(data, "representant.mobile", "") +
		"</p><p>";
	if (getProperty(data, "demande_contact_adherent", "")) {
		out += "<strong>La structure a souhaité être recontactée</strong>";
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
	var out = "Nouvelle adhésion (" + getProperty(data, "nom", "") + ")";
	return out;
};

/**
 * Front matter to
 * @param {Object} data
 * @return {String}
 */
export const to = function anonymous(data) {
	var out = "[object Object]";
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

const adhesion = {
	text,
	html,
	subject,
	to,
	bcc
};

const render = (data) =>
	Object.keys(adhesion).reduce((prev, key) => {
		prev[key] = adhesion[key](data);
		return prev;
	}, {});

export default render;
