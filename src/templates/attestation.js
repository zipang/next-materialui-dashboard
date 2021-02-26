// attestation.js

/**
 * Apply the data to the compiled TEXT template
 * @param {Object} data
 * @return {String}
 */
export const text = function anonymous(data) {
	var out =
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" />\n\n<h1 style="width: 80%; text-align: center; background-color: \'orange\'"> RECU D\'ADHESION ' +
		data.adhesion.reference +
		"</h1>\n\nL'association INVIE atteste avoir reçu au titre de l'année " +
		data.adhesion.annee +
		"\nl'adhésion de \n\n<h2 style=\"width: 80%; text-align: center; margin-left: auto; margin-right: auto; background-color: 'orange'\"> " +
		data.nom +
		" (N° de Siret `" +
		data.siret +
		"`)</h2>\n\nEn date du : " +
		data.adhesion.date +
		"\n\nLa somme de : **" +
		data.adhesion.montant +
		"** \n\nFait aux Mureaux, le " +
		new Date().toISOString().substr(0, 10) +
		", pour valoir ce que de droit.\n\n    **COUTEAU DELORD Stéphanie**\n    **Responsable Administratif et Financier**\n\n";
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
		data.adhesion.reference +
		"</h1><p>L'association INVIE atteste avoir reçu au titre de l'année " +
		data.adhesion.annee +
		"l'adhésion de</p><h2 style=\"width: 80%; text-align: center; margin-left: auto; margin-right: auto; background-color: 'orange'\"> " +
		data.nom +
		" (N° de Siret `" +
		data.siret +
		"`)</h2><p>En date du : " +
		data.adhesion.date +
		"</p><p>La somme de : <strong>" +
		data.adhesion.montant +
		"</strong></p><p>Fait aux Mureaux, le " +
		new Date().toISOString().substr(0, 10) +
		", pour valoir ce que de droit.</p><pre><code>**COUTEAU DELORD Stéphanie****Responsable Administratif et Financier**</code></pre>";
	return out;
};

/**
 * Front matter filename
 * @param {Object} data
 * @return {String}
 */
export const filename = function anonymous(data) {
	var out = "Attestation-Adhésion-" + data.siret + "-" + data.nom + ".pdf";
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
