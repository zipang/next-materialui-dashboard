const testData = {
	siret: "77777777777777",
	nom: "X",
	federation_reseau_enseigne: "ASSR",
	date_creation: "2001-01-01",
	adresse: {
		rue1: "1 BD JULES FERRI",
		rue2: "",
		code_postal: "98765",
		commune: "DOWNTOWN LA"
	},
	representant: {
		nom: "DOE",
		prenom: "JOHN",
		civilite: "M.",
		email: "john.doe@x.org",
		mobile: "06 65 65 65 65"
	},
	forme_juridique: "entreprise",
	contact: {
		telephone: "01 77 66 76 76",
		email: "contact@x.org",
		site_web: "",
		facebook: "",
		linkedin: "https://www.linkedin.com/in/johndoe/",
		twitter: "",
		instagram: "",
		autres: ""
	},
	convention_collective: "2941",
	antennes: "",
	declaration: {
		date: null,
		no: ""
	},
	agrement: {
		date: "2020-10-10",
		no: "SAP787788787"
	},
	autorisation: {
		date: null,
		no: ""
	},
	systemes_gestion: {
		dispositif_domycile: true,
		telegestion: true,
		telegestion_editeur: "DALLAS",
		teletransmission: true
	},
	certifications: {
		afnor: {
			statut: "N",
			date: null,
			no: ""
		},
		qualicert: {
			statut: "Y",
			date: "2021-12-10",
			no: "CERT7865756"
		},
		qualisap: {
			statut: "N",
			date: null,
			no: ""
		},
		cap_handeo: {
			statut: "N",
			date: null,
			no: ""
		},
		syneos: {
			statut: "N",
			date: null,
			cles: [],
			a_mettre_en_place: true,
			commentaires: "Ca m'a l'air très bien"
		}
	},
	effectifs: {
		total: 1,
		etp: 1,
		intervenants: 1,
		intervenants_etp: 1,
		cadres_intermediaires: 1,
		cadres_intermediaires_etp: 1
	},
	activite: {
		heures_cumulees: 2000,
		chiffre_affaires: 2000,
		beneficiaires: {
			pa: 0,
			ph: 0,
			pa_apa: 1,
			ph_pch: 1,
			petite_enfance: 0,
			enfance: 0,
			confort: 0,
			autres: null,
			autres_detail: ""
		},
		ratios: {
			pa: 10,
			ph: 0,
			transport: 0,
			petite_enfance: 10,
			mandataire: 10,
			prestataire: 10,
			confort: 0
		}
	},
	domaines: {
		codes: ["menage", "soutien_scolaire", "jardinage", "demarches_administratives"],
		autres: ""
	},
	demande_contact_adherent: true
};

export default testData;
