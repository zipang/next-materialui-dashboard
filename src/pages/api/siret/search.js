import { getOrganismeBySiret } from "@lib/client/SireneClient";

/**
 * API handler for `/siret/search` (Search Sirene Open Data API)
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} resp
 */
const search = async (req, resp) => {
	try {
		// Get the data and define the username as the login
		console.log("/api/siret/search received query", JSON.stringify(req.body));
		const { data } = req.body;
		const sireneData = await getOrganismeBySiret(data.siret);
		resp.json(sireneData);
	} catch (err) {
		console.error(err);
		resp.status(err.code || 500).json({
			success: false,
			error: `API Call to /siret/search failed with error : ${err.message}`
		});
	}
};

export default search;
