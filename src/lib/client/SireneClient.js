const getOrganismeBySiret = async (siret) => {
	const apiEntryPoint = `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`;
	if (!process.env.SIRENE_API_TOKEN) {
		throw new Error(`Le Token pour l'API Sirene n'a pas été trouvé`);
	}

	const resp = await fetch(apiEntryPoint, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization : Bearer": process.env.SIRENE_API_TOKEN
		}
	});

	const respBody = await resp.json();
	console.dir(`API POST to ${postUrl} returned`, respBody);

	if (respBody.error) {
		throw new Error(respBody.error);
	}
};
