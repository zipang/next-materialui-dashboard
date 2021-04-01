import { searchOrganismeBySiret } from "@lib/client/SireneClient.js";
import { retrieveBySiret } from "@models/Adherent.js";

/**
 * API handler for `/siret/search` (Search Sirene Open Data API)
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
const search = async (req, resp) => {
	try {
		// Get the data and define the username as the login
		console.log("/api/siret/search", JSON.stringify(req.body));
		const { siret } = req.body;
		const savedData = await retrieveBySiret(siret); // Was already stored in the database
		const siretData = savedData ? null : await searchOrganismeBySiret(siret);
		resp.json({ siret, siretData, savedData });
	} catch (err) {
		console.error(`/api/siret/search error`, err);
		resp.status(err.code || 500).json({
			success: false,
			error: err.code && err.code === 404 ? "N° de Siret Inconnu" : err.message
		});
	}
};

export default search;
