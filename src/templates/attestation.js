// attestation.js

/**
 * Apply the data to the compiled TEXT template
 * @param {Object} data
 * @return {String}
 */
export const text = (data) =>
	"|                                                | Date                      || :--------------------------------------------- | ------------------------: || ![logo](" +
	(data.env.NEXT_PUBLIC_SITE_URL + "/logo.svg") +
	")    |  ||     | Paris, le " +
	new Date().toISOString().substr(0, 10) +
	" |# ATTESTATION D'ADHESIONCe document confirme que votre société " +
	data.nom +
	" a bien souscrit un contrat d'adhésion en date du " +
	data.date_adhesion +
	"Le contrat a été signé par votre représentant " +
	data.representant.prenom +
	" " +
	data.representant.prenom;

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = (data) =>
	'<table><thead><tr><th align="left"></th><th align="right">Date</th></tr></thead><tbody><tr><td align="left">![logo](' +
	(data.env.NEXT_PUBLIC_SITE_URL + "/logo.svg") +
	')</td><td align="right"></td></tr><tr><td align="left"></td><td align="right">Paris, le ' +
	new Date().toISOString().substr(0, 10) +
	"</td></tr></tbody></table><h1>ATTESTATION D'ADHESION</h1><p>Ce document confirme que votre société " +
	data.nom +
	" a bien souscrit un contrat d'adhésion en date du " +
	data.date_adhesion +
	"</p><p>Le contrat a été signé par votre représentant " +
	data.representant.prenom +
	" " +
	data.representant.prenom +
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
