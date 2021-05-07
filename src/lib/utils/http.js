import https from "https";

export const post = async (apiEntryPoint, data) => {
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
