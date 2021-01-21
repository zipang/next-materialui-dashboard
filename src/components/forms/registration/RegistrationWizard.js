import { useAuthentication } from "@components/AuthenticationProvider";
import { SiretSearchForm } from "./SiretSearch";
import Wizard from "@forms/Wizard";

const steps = [
	{
		id: "step-01-siret-search",
		title: "Recherche de l'organisme par son no de SIRET",
		description: "Entrez le no de Siret et cliquez sur Rechercher",
		displayForm: (data, onSubmit) => <SiretSearchForm onSubmit={onSubmit} />
	},
	{
		id: "step-02-siret",
		title: "Nouvel Organisme",
		description: `Vérifiez l'adresse et la date de création de la structure à déclarer.`,
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
				required: true
			},
			{
				name: "date_creation",
				label: "Date de création",
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
						required: true
					},
					{
						name: "adresse.rue2",
						label: "Rue (complément)"
					},
					{
						name: "adresse.code_postal",
						label: "CP",
						size: 1 / 4,
						required: true
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
						name: "representant.civilite",
						label: "Civilité",
						size: 1 / 12,
						required: true
					},
					{
						name: "representant.nom",
						label: "Nom",
						size: 5 / 12,
						required: true
					},
					{
						name: "representant.prenom",
						label: "Prénom",
						size: 6 / 12,
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
						name: "telephone",
						label: "Fixe",
						type: "tel"
					}
				]
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
		id: "step-activite-beneficiaires",
		title: "Votre activité (ratios) et vos bénéficiaires",
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
		id: "step-domaines-activites",
		title: "Domaines d'activité",
		description: `Cochez chacun des domaines d'activité qui s'applique.`,
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
