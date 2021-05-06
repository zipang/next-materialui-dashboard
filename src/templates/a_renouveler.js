// a_renouveler.js
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
		getProperty(data, "today", "") +
		"\n\nVos références adhérent : **" +
		getProperty(data, "nom", "") +
		"** - Adh. n° **" +
		getProperty(data, "no", "") +
		"**\n\nBonjour,\n\nVotre adhésion à INVIE va bientôt arriver à expiration à sa date anniversaire le " +
		getProperty(data, "date_fin", "") +
		'.\n\nAfin de procéder à son renouvellement, merci de vous connecter dans <a href="' +
		getProperty(data, "env.NEXT_PUBLIC_SITE_URL", "") +
		"\">votre espace adhérent</a> et de revalider votre formulaire d'informations.\n \nPour toute question complémentaire ou demande de rdv, vous pouvez nous contacter par téléphone au 01 39 29 43 48 ou par mail contact@invie78.fr\n\nNous vous remercions pour votre confiance.\n\nCordialement,\n\nL’équipe d’INVIE\n";
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
		getProperty(data, "today", "") +
		"</p><p>Vos références adhérent : <strong>" +
		getProperty(data, "nom", "") +
		"</strong> - Adh. n° <strong>" +
		getProperty(data, "no", "") +
		"</strong></p><p>Bonjour,</p><p>Votre adhésion à INVIE va bientôt arriver à expiration à sa date anniversaire le " +
		getProperty(data, "date_fin", "") +
		'.</p><p>Afin de procéder à son renouvellement, merci de vous connecter dans <a href="' +
		getProperty(data, "env.NEXT_PUBLIC_SITE_URL", "") +
		'">votre espace adhérent</a> et de revalider votre formulaire d\'informations.</p><p>Pour toute question complémentaire ou demande de rdv, vous pouvez nous contacter par téléphone au 01 39 29 43 48 ou par mail <a href="mailto:contact@invie78.fr">contact@invie78.fr</a></p><p>Nous vous remercions pour votre confiance.</p><p>Cordialement,</p><p>L’équipe d’INVIE</p>';
	return out;
};

/**
 * Front matter subject
 * @param {Object} data
 * @return {String}
 */
export const subject = function anonymous(data) {
	var out = "Votre adhésion INVIE va bientôt expirer";
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
		getProperty(data, "adherent.representant.prenom", "") +
		" " +
		getProperty(data, "adherent.representant.nom", "") +
		'" <' +
		getProperty(data, "adherent.representant.email", "") +
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

const a_renouveler = {
	text,
	html,
	subject,
	to,
	bcc
};

const render = (data) =>
	Object.keys(a_renouveler).reduce((prev, key) => {
		prev[key] = a_renouveler[key](data);
		return prev;
	}, {});

export default render;
