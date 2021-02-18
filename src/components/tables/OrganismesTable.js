import DataTable from "./DataTable";


export const columns = [
	{ id: "nom", label: "Nom", minWidth: 200 },
	{ id: "adresse.code_postal", label: "CP", minWidth: 50 },

	{
		id: "adresse.commune",
		label: "Commune",
		minWidth: 200
	},
	{
		id: "effectifs.total",
		label: "Effectif",
		minWidth: 50,
		align: "right"
	},
	{
		id: "representant.nom",
		label: "Contact (nom)",
		minWidth: 150
	},
	{
		id: "representant.prenom",
		label: "Contact (prénom)",
		minWidth: 150
	},
	{
		id: "representant.mobile",
		label: "Contact (mobile)",
		minWidth: 100
	}
];

const OrganismesTable = ({}) => {
	const [rows, setRows] = React.useState([]);

	// Fetch the rows
	const Parse = ParseSDK.getInstance()
	const data = await Parse.Organisme.retrieve();
	setRows(data);
	
	return <DataTable rows={rows} columns={columns} />;
};

export default OrganismesTable;