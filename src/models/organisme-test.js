const testData = {
	siret: "53421553800016",
	nom: "EIDOLON LABS",
	federation_reseau_enseigne: "",
	date_creation: "2011-09-01",
	adresse: {
		rue1: "307 RUE DU MARECHAL LECLERC",
		rue2: "",
		code_postal: "78670",
		commune: "VILLENNES-SUR-SEINE"
	},
	representant: {
		nom: "DESGUEZ",
		prenom: "CHRISTOPHE",
		civilite: "M.",
		email: "christophe.desguez@gmail.com",
		mobile: "06 65 65 65 65"
	},
	statut: "entreprise",
	contact: {
		telephone: "01 77 66 76 76",
		email: "contact@eidolon-labs.fr",
		site_web: "",
		facebook: "",
		linkedin: "https://www.linkedin.com/in/cdesguez/",
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
	code: "agefos_pme",
	autre: "",
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
			no: "OOIJIOJIOJIOJOIJOIJ"
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
	demande_contact_adherent: "true"
};

export default testData;
