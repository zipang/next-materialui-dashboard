// adhesion.js

/**
 * Apply the data to the compiled TEXT template
 * @param {Object} data
 * @return {String}
 */
export const text = function anonymous(data) {
	var out =
		"La structure " +
		data.nom +
		" vient d'adhérer/renouveler son adhésion.\n\n\nLes coordonnées de la structure sont les suivantes :\n\n**" +
		data.nom +
		"**  \n" +
		data.adresse?.rue1 +
		"  \n" +
		data.adresse?.rue2 +
		"  \n" +
		data.adresse?.code_postal +
		" " +
		data.adresse?.commune +
		"  \n\nStandard: " +
		data.contact?.telephone +
		"  \nEmail: " +
		data.contact?.email +
		"\n\nReprésentant " +
		data.representant.prenom +
		" " +
		data.representant.nom +
		".\nEmail: " +
		data.representant?.email +
		"\nN° Mobile: " +
		data.representant?.mobile +
		"\n\n";
	if (data.demande_contact_adherent) {
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
		"<p>La structure " +
		data.nom +
		" vient d'adhérer/renouveler son adhésion.</p><p>Les coordonnées de la structure sont les suivantes :</p><p><strong>" +
		data.nom +
		"</strong><br />" +
		data.adresse?.rue1 +
		"<br />" +
		data.adresse?.rue2 +
		"<br />" +
		data.adresse?.code_postal +
		" " +
		data.adresse?.commune +
		"</p><p>Standard: " +
		data.contact?.telephone +
		"<br />Email: " +
		data.contact?.email +
		"</p><p>Représentant " +
		data.representant.prenom +
		" " +
		data.representant.nom +
		".Email: " +
		data.representant?.email +
		"N° Mobile: " +
		data.representant?.mobile +
		"</p><p>";
	if (data.demande_contact_adherent) {
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
	var out = "Nouvelle adhésion (" + data.nom + ")";
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
