import { getAdherentBySiret } from "@lib/client/SireneClient";
import { retrieveBySiret } from "@models/Adherent";

/**
 * API handler for `/siret/search` (Search Sirene Open Data API)
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
const search = async (req, resp) => {
	try {
		// Get the data and define the username as the login
		console.log("/api/siret/search received query", JSON.stringify(req.body));
		const { siret } = req.body;
		const [siretData, savedData] = await Promise.all([
			getAdherentBySiret(siret),
			retrieveBySiret(siret)
		]);
		resp.json({ siret, siretData, savedData });
	} catch (err) {
		console.error(`/siret/search error`, err);
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};

export default search;
