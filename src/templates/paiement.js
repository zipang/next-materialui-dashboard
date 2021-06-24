// paiement.js
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
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" />\n\nLes Mureaux, le ' +
		new Date().toISOString().substr(0, 10) +
		"\n\nVos références : " +
		getProperty(data, "adhesion.no", "") +
		" - " +
		getProperty(data, "nom", "") +
		"\n\nBonjour,\n\nNous accusons bonne réception de votre paiement pour l'adhésion " +
		getProperty(data, "adhesion.no", "") +
		".\nVous pouvez trouver en pièce jointe l'attestation d'adhésion.\n\n\nEn vous remerciant pour votre confiance,\nCordialement,\n\nL’équipe d’INVIE\n\nPour toute question complémentaire, vous pouvez nous contacter par téléphone au 01 39 29 43 48 ou par mail contact@invie78.fr\n";
	return out.replace(/(<([^>]+)>)/gi, "");
};

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = function anonymous(data) {
	var out =
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" /><p>Les Mureaux, le ' +
		new Date().toISOString().substr(0, 10) +
		"</p><p>Vos références : " +
		getProperty(data, "adhesion.no", "") +
		" - " +
		getProperty(data, "nom", "") +
		"</p><p>Bonjour,</p><p>Nous accusons bonne réception de votre paiement pour l'adhésion " +
		getProperty(data, "adhesion.no", "") +
		".Vous pouvez trouver en pièce jointe l'attestation d'adhésion.</p><p>En vous remerciant pour votre confiance,Cordialement,</p><p>L’équipe d’INVIE</p><p>Pour toute question complémentaire, vous pouvez nous contacter par téléphone au 01 39 29 43 48 ou par mail <a href=\"mailto:contact@invie78.fr\">contact@invie78.fr</a></p>";
	return out;
};

/**
 * Front matter subject
 * @param {Object} data
 * @return {String}
 */
export const subject = function anonymous(data) {
	var out = "Votre adhésion INVIE (" + getProperty(data, "nom", "") + ") est validée";
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
	var out = "zipang <christophe.desguez@gmail.com>, contact@invie78.fr";
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

const paiement = {
	text,
	html,
	subject,
	to,
	bcc,
	attachments
};

const render = (data) =>
	Object.keys(paiement).reduce((prev, key) => {
		prev[key] = paiement[key](data);
		return prev;
	}, {});

export default render;
