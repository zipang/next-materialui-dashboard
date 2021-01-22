import { useAuthentication } from "@components/AuthenticationProvider";
import { SiretSearchForm } from "./SiretSearch";
import Wizard from "@forms/Wizard";

export const steps = [
	{
		id: "step-01-siret-search",
		title: "Recherche de l'organisme par son no de SIRET",
		description: "Entrez le no de Siret et cliquez sur Rechercher",
		displayForm: (data, onSubmit) => <SiretSearchForm onSubmit={onSubmit} />
	},
	{
		id: "step-02-siret",
		title: "Nouvel Organisme",
		help: {
			description: `Vérifiez l'adresse et la date de création de la structure à déclarer.`
		},
		fields: [
			{
				name: "siret",
				label: "No de Siret",
				type: "siret",
				readOnly: true
			},
			{
				name: "nom",
				label: "Nom",
				validation: {
					required: "Saisissez le nom de votre structure"
				}
			},
			{
				name: "date_creation",
				label: "Création",
				type: "date",
				size: 1 / 4,
				validation: {
					required: "Saisissez la date de création de l'entreprise"
				}
			},
			{
				name: "statut",
				label: "Statut",
				type: "select",
				options: [
					{ code: "association", label: "Association" },
					{ code: "entreprise", label: "Entreprise" },
					{ code: "ccas-cias", label: "CCAS / CIAS" }
				],
				size: 3 / 4,
				validation: {
					required: "Saisissez le statut de l'entreprise"
				}
			},
			{
				type: "group",
				label: "Adresse",
				fields: [
					{
						name: "adresse.rue1",
						label: "Rue",
						validation: {
							required: "Indiquez la rue"
						}
					},
					{
						name: "adresse.rue2",
						label: "Rue (complément)"
					},
					{
						name: "adresse.code_postal",
						label: "CP",
						size: 1 / 4,
						validation: {
							required: "Indiquez le code postal"
						}
					},
					{
						name: "adresse.commune",
						label: "Ville",
						size: 3 / 4,
						required: true
					}
				]
			}
		]
	},
	{
		id: "step-03-contacts",
		title: "Contacts",
		help: {
			description: `Indiquez le représentant de l'organisme, 
les emails et nos de téléphone ou vous êtes joignables
ainsi que les sites internet liés à votre activité.`
		},
		fields: [
			{
				label: "Représentant",
				type: "group",
				fields: [
					{
						name: "representant.nom",
						label: "Nom",
						size: 1 / 2,
						required: true
					},
					{
						name: "representant.prenom",
						label: "Prénom",
						size: 1 / 2,
						required: true
					},
					{
						name: "representant.email",
						label: "Email",
						type: "email",
						size: 1 / 2,
						required: true
					},
					{
						name: "representant.mobile",
						label: "Mobile",
						type: "tel",
						size: 1 / 2,
						required: true
					}
				]
			},
			{
				label: "Contact",
				type: "group",
				fields: [
					{
						name: "contact.telephone",
						label: "Téléphone",
						type: "tel",
						size: 1 / 2
					},
					{
						name: "contact.mail",
						label: "Email",
						type: "email",
						size: 1 / 2
					}
				]
			},
			{
				label: "Liens Internet",
				type: "group",
				fields: [
					{
						name: "contact.site_web",
						label: "Site Web",
						type: "url",
						size: 1 / 2
					},
					{
						name: "contact.facebook",
						label: "Facebooks",
						type: "url",
						size: 1 / 2
					},
					{
						name: "contact.linkedin",
						label: "LinkedIn",
						type: "url",
						size: 1 / 2
					},
					{
						name: "contact.twitter",
						label: "Twitter",
						type: "url",
						size: 1 / 2
					},
					{
						name: "contact.instagram",
						label: "Instagram",
						type: "url",
						size: 1 / 2
					},
					{
						name: "contact.autres",
						label: "Autres",
						type: "url",
						size: 1 / 2
					}
				]
			}
		]
	},
	{
		id: "step-systemes-gestion",
		title: "Systèmes de Gestion",
		help: {
			description:
				"Indiquez les systèmes de télégestion, télédéclaration mis en place dans votre structure."
		},
		fields: [
			{
				name: "systemes_gestion.dispositif_domycile",
				label: "Dispositif Domycile",
				type: "switch"
			},
			{
				name: "systemes_gestion.telegestion",
				label: "Système de télégestion"
			},
			{
				name: "systemes_gestion.teletransmission",
				label: "Système de télétransmission",
				type: "switch"
			}
		]
	},
	{
		id: "step-04-declarations",
		title: "Réseau, Déclarations, Agréments..",
		help: {
			description: `Indiquez votre convention collective, les antennes et ou réseau, enseigne..
Puis indiquez vos numéros d'agrémentation.`
		},
		fields: [
			{
				name: "convention_collective",
				label: "Convention Collective",
				type: "select",
				options: {
					"3127": "CC Entreprises de Services à la Personne",
					"2941": "CC Aide, Accompagnement, Soins et Services à domicile"
				}
			},
			{
				name: "antennes",
				label: "Antennes"
			},
			{
				name: "federation_reseau_enseigne",
				label: "Fédération, Réseau ou Enseigne"
			},
			{
				label: "Déclaration",
				type: "group",
				fields: [
					{
						name: "declaration.date",
						label: "Date",
						type: "date",
						size: 1 / 2
					},
					{
						name: "declaration.no",
						label: "No",
						size: 1 / 2,
						validation: {
							pattern: {
								value: /^SAP(\d){9}/,
								message:
									"Le no de déclaration doit commencer par SAP suivi de 9 chiffres.\n Exemple: SAP123456789"
							}
						}
					}
				]
			},
			{
				label: "Agrément",
				type: "group",
				fields: [
					{
						name: "agrement.date",
						label: "Date",
						type: "date",
						size: 1 / 2
					},
					{
						name: "agrement.no",
						label: "No",
						size: 1 / 2,
						validation: {
							pattern: {
								value: /^SAP(\d){9}/,
								message:
									"Le no d'agrément doit commencer par SAP suivi de 9 chiffres.\n Exemple: SAP123456789"
							}
						}
					}
				]
			},
			{
				label: "Autorisation",
				type: "group",
				fields: [
					{
						name: "autorisation.date",
						label: "Date",
						type: "date",
						size: 1 / 2
					},
					{
						name: "autorisation.no",
						label: "No",
						size: 1 / 2,
						validation: {
							pattern: {
								value: /(\d){4}-(\d){2-3}/,
								message:
									"Le no d'autorisation doit commencer par une année, un tiret puis 2 ou 3 chiffres.\n Exemple : 2018-34"
							}
						}
					}
				]
			},
			{
				name: "opco",
				label: "OPCO",
				type: "group",
				fields: [
					{
						name: "code",
						type: "select",
						size: 1 / 2,
						options: {
							agefos_pme: "Agefos PME",
							entreprise: "Entreprise",
							autre: "Autre"
						}
					},
					{
						name: "autre",
						label: "Autre",
						size: 1 / 2
					}
				]
			}
		]
	},
	{
		id: "step-05-certifications",
		title: "Vos certifications",
		help: {
			description: `Indiquez les certifications obtenues
et celles que vous souhaiteriez mettre en oeuvre.`
		},
		fields: [
			{
				label: "CERTIFICATION AFNOR",
				type: "group",
				fields: [
					{
						name: "certifications.afnor.en_cours",
						label: "En Cours",
						type: "switch",
						size: 3 / 12
					},
					{
						name: "certifications.afnor.date",
						label: "Date",
						type: "date",
						size: 3 / 12
					},
					{
						name: "certifications.afnor.no",
						label: "No",
						size: 6 / 12
					}
				]
			},
			{
				label: "CERTIFICATION QUALICERT",
				type: "group",
				fields: [
					{
						name: "certifications.qualicert.en_cours",
						label: "En Cours",
						type: "switch",
						size: 3 / 12
					},
					{
						name: "certifications.qualicert.date",
						label: "Date",
						type: "date",
						size: 3 / 12
					},
					{
						name: "certifications.qualicert.no",
						label: "No",
						size: 6 / 12
					}
				]
			},
			{
				label: "CERTIFICATION QUALISAP",
				type: "group",
				fields: [
					{
						name: "certifications.qualisap.en_cours",
						label: "En Cours",
						type: "switch",
						size: 3 / 12
					},
					{
						name: "certifications.qualisap.date",
						label: "Date",
						type: "date",
						size: 3 / 12
					},
					{
						name: "certifications.qualisap.no",
						label: "No",
						size: 6 / 12
					}
				]
			},
			{
				label: "CERTIFICATION CAP'HANDEO",
				type: "group",
				fields: [
					{
						name: "certifications.cap_handeo.en_cours",
						label: "En Cours",
						type: "switch",
						size: 3 / 12
					},
					{
						name: "certifications.cap_handeo.date",
						label: "Date",
						type: "date",
						size: 3 / 12
					},
					{
						name: "certifications.cap_handeo.no",
						label: "No",
						size: 6 / 12
					}
				]
			}
		]
	},
	{
		id: "step-06-syneos",
		title: "Le Label Syneos",
		help: {
			description: `Indiquez les clés obtenues
et celles que vous souhaiteriez mettre en oeuvre.`
		},
		fields: [
			{
				label: "LABEL SYNEOS",
				type: "group",
				fields: [
					{
						name: "certifications.syneos.en_cours",
						label: "En Cours",
						type: "switch",
						size: 3 / 12
					},
					{
						name: "certifications.syneos.date",
						label: "Date",
						type: "date",
						size: 3 / 12
					},
					{
						name: "certifications.syneos.no",
						label: "No",
						size: 6 / 12
					},
					{
						name: "certifications.syneos.cles",
						label: "Clés obtenues",
						type: "checkboxes",
						options: {
							cle1: "Clé 1",
							cle2: "Clé 2",
							cle3: "Clé 3",
							cle4: "Clé 4",
							cle5: "Clé 5",
							cle6: "Clé 6"
						}
					}
				]
			},
			{
				name: "certifications.syneos.a_mettre_en_place",
				label: "Je souhaite mettre en place ce label",
				type: "switch"
			},
			{
				name: "certifications.syneos.commentaires",
				label: "Commentaires",
				placeHolder: "Souhaitez-vous obtenir une ou des clés supplémentaires ?"
			}
		]
	},
	{
		id: "step-effectifs",
		title: "Vos Effectifs",
		help: {
			description: `Indiquez vos effectifs en distinguant bien :
l'effectif total par catégorie dans la colonne de gauche
les équivalents temps plein (ETP) dans la colonne de droite`
		},
		fields: [
			{
				label: "Nombre de salariés",
				type: "group",
				fields: [
					{
						name: "effectifs.total",
						label: "Total",
						type: "integer",
						size: 1 / 2,
						defaultValue: 0
					},
					{
						name: "effectifs.etp",
						label: "ETP",
						type: "integer",
						size: 1 / 2,
						defaultValue: 0
					}
				]
			},
			{
				label: "Nombre d'intervenants",
				type: "group",
				fields: [
					{
						name: "effectifs.intervenants",
						label: "Total",
						type: "integer",
						size: 1 / 2,
						defaultValue: 0
					},
					{
						name: "effectifs.intervenants_etp",
						label: "ETP",
						type: "integer",
						size: 1 / 2,
						defaultValue: 0
					}
				]
			},
			{
				label: "Nombre de cadres intermédiaires",
				type: "group",
				fields: [
					{
						name: "effectifs.cadres_intermediaires",
						label: "Total",
						type: "integer",
						size: 1 / 2,
						defaultValue: 0
					},
					{
						name: "effectifs.cadres_intermediaires_etp",
						label: "ETP",
						type: "integer",
						size: 1 / 2,
						defaultValue: 0
					}
				]
			}
		]
	},
	{
		id: "step-activite-beneficiaires",
		title: "Votre activité (ratios) et vos bénéficiaires",
		help: {
			description: `Indiquez tout d'abord les ratios (%) d'activité dans chaque catégorie d'intervention.
Indiquez ensuite les effectifs (nb de personnes bénéficiaires) pour ces mêmes catégories d'intervention.`
		},
		fields: [
			{
				label: "Votre Activité (ratios)",
				type: "group",
				fields: [
					{
						name: "activite.ratios.pa",
						label: "Personnes Agées",
						type: "percent",
						size: 1 / 2
					},
					{
						name: "activite.ratios.ph",
						label: "Personnes Handicapées",
						type: "percent",
						size: 1 / 2
					},
					{
						name: "activite.ratios.transport",
						label: "Transport adapté",
						type: "percent",
						size: 1 / 2
					},
					{
						name: "activite.ratios.petite_enfance",
						label: "Enfance (-3 ans)",
						type: "percent",
						size: 1 / 2
					},
					{
						name: "activite.ratios.mandataire",
						label: "Part Mandataires",
						type: "percent",
						size: 1 / 2
					},
					{
						name: "activite.ratios.prestataire",
						label: "Part Prestataires",
						type: "percent",
						size: 1 / 2
					},
					{
						name: "activite.ratios.confort",
						label: "Activité de confort",
						type: "percent",
						size: 1 / 2
					}
				]
			},
			{
				label: "Vos Bénéficiaires (effectif)",
				type: "group",
				fields: [
					{
						name: "activite.beneficiaires.pa",
						label: "Personnes Agées",
						type: "integer",
						size: 1 / 2
					},
					{
						name: "activite.beneficiaires.ph",
						label: "Personnes Handicapées",
						type: "integer",
						size: 1 / 2
					},
					{
						name: "activite.beneficiaires.pa_apa",
						label: "Bénéficiaires APA",
						type: "integer",
						size: 1 / 2
					},
					{
						name: "activite.beneficiaires.ph_pch",
						label: "Bénéficiaires PCH",
						type: "integer",
						size: 1 / 2
					},
					{
						name: "activite.beneficiaires.petite_enfance",
						label: "Enfance (-3 ans)",
						type: "integer",
						size: 1 / 2
					},
					{
						name: "activite.beneficiaires.enfance",
						label: "Enfance (+3 ans)",
						type: "integer",
						size: 1 / 2
					},
					{
						name: "activite.beneficiaires.confort",
						label: "Bénéficiaires confort",
						type: "integer",
						size: 1 / 2
					},
					{
						name: "activite.beneficiaires.autres",
						label: "Autres",
						type: "integer",
						size: 1 / 2
					},
					{
						name: "activite.beneficiaires.autres_detail",
						label: "(Préciser)"
					}
				]
			}
		]
	},
	{
		id: "step-domaines-intervention",
		title: "Domaines d'intervention",
		description: `Cochez chacun des domaines d'intervention qui s'applique à votre activité.`,
		fields: [
			{
				name: "domaines.codes",
				type: "checkboxes",
				options: {
					aide_a_la_toilette: "Aide à la Toilette",
					accompagnement: "Accompagnement",
					animation: "Animation",
					bricolage: "Bricolage",
					transports: "Transports",
					courses: "Courses",
					garde_enfants: "Garde d'enfants",
					garde_malade: "Garde Malade / de nuit",
					soutien_scolaire: "Soutine scolaire",
					homme_a_tout_faire: "Homme 'toutes mains'",
					jardinage: "Jardinage",
					menage: "Ménage",
					portage_repas: "Portage repas",
					repassage: "Repassage",
					repas: "Repas",
					demarches_administratives: "Démarches administratives et numériques",
					autre: "Autres"
				}
			},
			{
				name: "domaines.autres",
				label: "Autres activités"
			}
		]
	}
];

/**
 * Look if we have an incomplete registration process in the local storage
 * Or create
 */
const initRegistration = (loggedUser) => {};

const RegistrationWizard = () => {
	const loggedUser = useAuthentication();
	const data = initRegistration(loggedUser);
	return <Wizard id="registration-wizard" data={data} steps={steps} />;
};

export default RegistrationWizard;
