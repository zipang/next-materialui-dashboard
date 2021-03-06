import { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Skeleton from "@material-ui/lab/Skeleton";
import AdherentsApiClient from "@lib/client/AdherentsApiClient";
import { Box } from "@material-ui/core";

export const columns = [
	{
		id: "nom",
		label: "Nom",
		minWidth: 200,
		link: ({ siret }) => `/admin/adherents/${siret}`
	},
	{ id: "adresse.code_postal", label: "CP", minWidth: 50 },
	{ id: "adresse.commune", label: "Commune", minWidth: 220 },
	{ id: "effectifs.total", label: "Effectif", minWidth: 40, align: "right" },
	{ id: "representant.nom", label: "Contact (nom)", minWidth: 80 },
	{ id: "representant.prenom", label: "Contact (prénom)", minWidth: 80 },
	{ id: "representant.mobile", label: "Contact (mobile)", minWidth: 80 }
];

const applyFilter = (filter, rows) =>
	rows.filter((row) => {
		let displayRow = true;
		Object.keys(filter).forEach((fieldName) => {
			if (row[fieldName] !== filter[fieldName]) displayRow = false;
		});
		return displayRow;
	});

const AdherentsDataTable = ({ filter = {} }) => {
	const [rows, setRows] = useState();
	const [error, setError] = useState();

	// Fetch the rows
	useEffect(async () => {
		try {
			console.log(`Fetching adherents...`);
			setRows((await AdherentsApiClient.retrieve()).rows);
		} catch (err) {
			setError(err.message);
		}
	}, [false]);

	return rows ? (
		<DataTable rows={applyFilter(filter, rows)} columns={columns} />
	) : error ? (
		<Box className="error">{error}</Box>
	) : (
		<Skeleton width={1200} height={800} />
	);
};

export default AdherentsDataTable;
