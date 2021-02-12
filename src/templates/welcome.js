// welcome.js

/**
 * Apply the data to the compiled TEXT template
 * @param {Object} data
 * @return {String}
 */
export const text = (data) =>
	'<img src="https://invie78.fr/images/logo.jpg" alt="logo" />Paris, le ' +
	new Date().toISOString().substr(0, 10) +
	"Bonjour **" +
	data.representant.prenom +
	" " +
	data.representant.nom +
	"**,L'enregistrement de votre société **" +
	data.nom +
	"** a bien été pris en compte en date du " +
	data.date_creation +
	".";

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = (data) =>
	'<img src="https://invie78.fr/images/logo.jpg" alt="logo" /><p>Paris, le ' +
	new Date().toISOString().substr(0, 10) +
	"</p><p>Bonjour <strong>" +
	data.representant.prenom +
	" " +
	data.representant.nom +
	"</strong>,</p><p>L'enregistrement de votre société <strong>" +
	data.nom +
	"</strong> a bien été pris en compte en date du " +
	data.date_creation +
	".</p>";

/**
 * Front matter subject
 * @param {Object} data
 * @return {String}
 */
export const subject = (data) => "L'enregistrement de " + data.nom + " a bien été reçu";

/**
 * Front matter to
 * @param {Object} data
 * @return {String}
 */
export const to = (data) =>
	'"' +
	data.representant.prenom +
	" " +
	data.representant.nom +
	'" <' +
	data.representant.email +
	">";

/**
 * Front matter bcc
 * @param {Object} data
 * @return {String}
 */
export const bcc = (data) => "zipang <christophe.desguez@gmail.com>";

/**
 * Front matter attachments
 * @param {Object} data
 * @return {String}
 */
export const attachments = (data) => "attestation";

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
