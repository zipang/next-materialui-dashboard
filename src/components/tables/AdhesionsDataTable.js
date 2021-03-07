import { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Skeleton from "@material-ui/lab/Skeleton";
import { Box } from "@material-ui/core";
import AdherentsApiClient from "@lib/client/AdherentsApiClient";

const displayDate = (isoDate) => {
	if (!isoDate) return "";
	const [year, month, day] = isoDate.split("-");
	return [day, month, year].join("/");
};
/**
 * Labels for payment modes
 */
const MODE_PAIEMENTS = {
	cheque: "Par Chèque",
	en_ligne: "En Ligne"
};

export const columns = [
	{ id: "no", label: "N°", minWidth: 80 },
	{
		id: "nom",
		label: "Adhérent",
		minWidth: 200,
		link: ({ siret }) => `/admin/adherents/${siret}`
	},
	{
		id: "mode_paiement",
		label: "Mode Paiement",
		minWidth: 80,
		format: (code) => MODE_PAIEMENTS[code],
		button: (adhesion) => {
			if (adhesion.mode_paiement === "cheque") {
				return {
					label: "Confirmer Paiement",
					action: async () => {
						const paymentData = {
							date: "",
							montant: 200
						};
						await AdherentsApiClient.confirmAdhesion(
							adhesion.no,
							paymentData
						);
					}
				};
			}
		}
	},
	{ id: "date_debut", label: "Date début", minWidth: 100, format: displayDate },
	{ id: "date_fin", label: "Date fin", minWidth: 100, format: displayDate }
];

const applyFilter = (filter, rows) =>
	rows.filter((row) => {
		let displayRow = true;
		Object.keys(filter).forEach((fieldName) => {
			if (row[fieldName] !== filter[fieldName]) displayRow = false;
		});
		return displayRow;
	});

const AdhesionsDataTable = ({ filter = {} }) => {
	const [rows, setRows] = useState();
	const [error, setError] = useState();

	// Fetch the rows
	useEffect(async () => {
		try {
			console.log(`Fetching adhesions...`);
			setRows((await AdherentsApiClient.retrieveAdhesions()).rows);
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

export default AdhesionsDataTable;
