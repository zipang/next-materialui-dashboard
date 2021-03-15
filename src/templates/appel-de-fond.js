// appel_de_fond.js
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
		'<style>html{font-family: Arial, serif; font-size: 18px;}</style>\n<img src="https://invie78.fr/images/logo.jpg" alt="logo" />\n\n<h1 style="width: 100%; text-align: center; background-color: \'orange\'; margin: 50px 0">\nMONTANT ADHESION ' +
		getProperty(data, "year", "") +
		"\n</h1>\n\nL'association INVIE atteste que l'adhésion de **" +
		getProperty(data, "adherent.nom", "") +
		"** (N° de Siret `" +
		getProperty(data, "adherent.siret", "") +
		"`)  \nau titre de l'année " +
		getProperty(data, "year", "") +
		" requiert le réglement d'un montant de : **" +
		getProperty(data, "adhesion.montant", "") +
		"€**  \n\nFait aux Mureaux, le " +
		getProperty(data, "date", "") +
		", pour valoir ce que de droit.\n\n    **COUTEAU DELORD Stéphanie**  \n    **Responsable Administratif et Financier**\n\n";
	return out.replace(/(<([^>]+)>)/gi, "");
};

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = function anonymous(data) {
	var out =
		'<style>html{font-family: Arial, serif; font-size: 18px;}</style><img src="https://invie78.fr/images/logo.jpg" alt="logo" /><h1 style="width: 100%; text-align: center; background-color: \'orange\'; margin: 50px 0">MONTANT ADHESION ' +
		getProperty(data, "year", "") +
		"</h1><p>L'association INVIE atteste que l'adhésion de <strong>" +
		getProperty(data, "adherent.nom", "") +
		"</strong> (N° de Siret <code>" +
		getProperty(data, "adherent.siret", "") +
		"</code>)<br />au titre de l'année " +
		getProperty(data, "year", "") +
		" requiert le réglement d'un montant de : <strong>" +
		getProperty(data, "adhesion.montant", "") +
		"€</strong></p><p>Fait aux Mureaux, le " +
		getProperty(data, "date", "") +
		", pour valoir ce que de droit.</p><pre><code>**COUTEAU DELORD Stéphanie** **Responsable Administratif et Financier**</code></pre>";
	return out;
};

/**
 * Front matter filename
 * @param {Object} data
 * @return {String}
 */
export const filename = function anonymous(data) {
	var out =
		"Appel-de-fond-INVIE-" +
		getProperty(data, "year", "") +
		"-" +
		getProperty(data, "adherent.nom", "") +
		".pdf";
	return out;
};

const appel_de_fond = {
	text,
	html,
	filename
};

const render = (data) =>
	Object.keys(appel_de_fond).reduce((prev, key) => {
		prev[key] = appel_de_fond[key](data);
		return prev;
	}, {});

export default render;
