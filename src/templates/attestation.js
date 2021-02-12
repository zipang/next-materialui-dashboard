// attestation.js

/**
 * Apply the data to the compiled TEXT template
 * @param {Object} data
 * @return {String}
 */
export const text = (data) =>
	'<img src="https://invie78.fr/images/logo.jpg" alt="logo" />Paris, le ' +
	new Date().toISOString().substr(0, 10) +
	"# ATTESTATION D'ADHESIONCe document confirme que votre société **" +
	data.nom +
	"** (N° de Siret " +
	data.siret +
	") a bien souscrit un contrat d'adhésion auprès du service **INVIE** en date du " +
	data.date_adhesion +
	"Le contrat a été signé par votre représentant " +
	data.representant.prenom +
	" " +
	data.representant.prenom +
	".Les coordonnées de votre société sont les suivantes :**" +
	data.nom +
	"**" +
	data.adresse.rue1 +
	data.adresse.rue2 +
	data.adresse.code_postal +
	" " +
	data.adresse.commune +
	"Standard: " +
	data.contact.telephone +
	"Email: " +
	data.contact.email;

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = (data) =>
	'<img src="https://invie78.fr/images/logo.jpg" alt="logo" /><p>Paris, le ' +
	new Date().toISOString().substr(0, 10) +
	"</p><h1>ATTESTATION D'ADHESION</h1><p>Ce document confirme que votre société <strong>" +
	data.nom +
	"</strong> (N° de Siret " +
	data.siret +
	") a bien souscrit un contrat d'adhésion auprès du service <strong>INVIE</strong> en date du " +
	data.date_adhesion +
	"</p><p>Le contrat a été signé par votre représentant " +
	data.representant.prenom +
	" " +
	data.representant.prenom +
	".</p><p>Les coordonnées de votre société sont les suivantes :</p><p><strong>" +
	data.nom +
	"</strong>" +
	data.adresse.rue1 +
	data.adresse.rue2 +
	data.adresse.code_postal +
	" " +
	data.adresse.commune +
	"</p><p>Standard: " +
	data.contact.telephone +
	"Email: " +
	data.contact.email +
	"</p>";

/**
 * Front matter filename
 * @param {Object} data
 * @return {String}
 */
export const filename = (data) => "Attestation-Adhésion-" + data.siret + ".pdf";

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
