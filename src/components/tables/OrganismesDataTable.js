import { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Skeleton from "@material-ui/lab/Skeleton";
import OrganismesApiClient from "@lib/client/OrganismesApiClient";
import { Box } from "@material-ui/core";

export const columns = [
	{ id: "nom", label: "Nom", minWidth: 200 },
	{ id: "adresse.code_postal", label: "CP", minWidth: 50 },
	{ id: "adresse.commune", label: "Commune", minWidth: 220 },
	{ id: "effectifs.total", label: "Effectif", minWidth: 40, align: "right" },
	{ id: "representant.nom", label: "Contact (nom)", minWidth: 80 },
	{ id: "representant.prenom", label: "Contact (prénom)", minWidth: 80 },
	{ id: "representant.mobile", label: "Contact (mobile)", minWidth: 80 }
];

const OrganismesDataTable = ({}) => {
	const [rows, setRows] = useState();
	const [error, setError] = useState();

	// Fetch the rows
	useEffect(async () => {
		try {
			setRows((await OrganismesApiClient.retrieve()).rows);
		} catch (err) {
			setError(err.message);
		}
	});

	return rows ? (
		<DataTable rows={rows} columns={columns} />
	) : error ? (
		<Box className="error">{error}</Box>
	) : (
		<Skeleton width={1200} height={800} />
	);
};

export default OrganismesDataTable;
