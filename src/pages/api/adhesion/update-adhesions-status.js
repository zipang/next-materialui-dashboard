import { getParseInstance } from "@models/ParseSDK.js";
import https from "https";

const formatDate = (d) => d.toISOString().substr(0, 10); // YYYY-MM-DD

const httpPost = async (apiEntryPoint, data) => {
	const jsonData = JSON.stringify(data);
	const url = new URL(apiEntryPoint);
	let apiResponse = "";
	const sentPromise = new Promise((resolve, reject) => {
		const request = https.request(
			{
				method: "POST",
				port: 443,
				hostname: url.hostname,
				path: url.pathname,
				headers: {
					"Content-Type": "application/json",
					"Content-Length": jsonData.length
				}
			},
			(resp) => {
				resp.on("data", (data) => {
					apiResponse += data;
				});
				resp.on("end", () => resolve(apiResponse));
			}
		);
		request.on("error", (error) => {
			reject(error);
		});
		request.write(jsonData);
		request.end();
	});
	return sentPromise;
};

/**
 *
 */
const updateAdhesionsStatus = async () => {
	try {
		const today = new Date();
		const inAMonth = today.setMonth(today.getMonth + 1);

		// Look for all the adhesions that will expire in a month
		const Parse = await getParseInstance();
		const query = Parse.Query("Adhesion");
		query.lessThanOrEqualTo("date_fin", formatDate(inAMonth));

		const pendingAdhesions = await query.findAll();

		await Promise.all(
			pendingAdhesions.map(async (adhesion) => {
				const statut = adhesion.get("statut");
				const date_fin = adhesion.get("date_fin");

				if (statut === "active") {
					// Warn the adherent that he will have to renew his adhesion
					adhesion.set("statut", "a_renouveler");
					await adhesion.save();
				} else if (date_fin < formatDate(today)) {
					adhesion.set("statut", "closed");
					const adherent = adhesion.get("adherent");
					adherent.set("statut", "inactif");
					await Promise.all([adherent.save(), adhesion.save()]);
				}
			})
		);
	} catch (err) {
		console.error("updateAdhesionsStatus CRON Job failed", err);
	}
};

export default updateAdhesionsStatus;
