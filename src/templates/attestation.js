// attestation.js
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
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" />\n\n<h1 style="width: 80%; text-align: center; background-color: \'orange\'"> RECU D\'ADHESION ' +
		getProperty(data, "adhesion.no", "") +
		"</h1>\n\nL'association INVIE atteste avoir reçu au titre de l'année " +
		new Date().toISOString().substr(0, 10) +
		"\nl'adhésion de \n\n<h2 style=\"width: 80%; text-align: center; margin-left: auto; margin-right: auto; background-color: 'orange'\"> " +
		getProperty(data, "nom", "") +
		" (N° de Siret `" +
		getProperty(data, "siret", "") +
		"`)</h2>\n\nEn date du : " +
		getProperty(data, "adhesion.date_debut", "") +
		"\n\nLa somme de : **" +
		getProperty(data, "adhesion.montant", "") +
		"**  \n\nFait aux Mureaux, le " +
		new Date().toISOString().substr(0, 10) +
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
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" /><h1 style="width: 80%; text-align: center; background-color: \'orange\'"> RECU D\'ADHESION ' +
		getProperty(data, "adhesion.no", "") +
		"</h1><p>L'association INVIE atteste avoir reçu au titre de l'année " +
		new Date().toISOString().substr(0, 10) +
		"l'adhésion de</p><h2 style=\"width: 80%; text-align: center; margin-left: auto; margin-right: auto; background-color: 'orange'\"> " +
		getProperty(data, "nom", "") +
		" (N° de Siret `" +
		getProperty(data, "siret", "") +
		"`)</h2><p>En date du : " +
		getProperty(data, "adhesion.date_debut", "") +
		"</p><p>La somme de : <strong>" +
		getProperty(data, "adhesion.montant", "") +
		"</strong></p><p>Fait aux Mureaux, le " +
		new Date().toISOString().substr(0, 10) +
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
		"Adhésion-INVIE-" +
		new Date().toISOString().substr(0, 10) +
		"-" +
		getProperty(data, "nom", "") +
		".pdf";
	return out;
};

const attestation = {
	text,
	html,
	filename
};

const render = (data) =>
	Object.keys(attestation).reduce((prev, key) => {
		prev[key] = attestation[key](data);
		return prev;
	}, {});

export default render;
