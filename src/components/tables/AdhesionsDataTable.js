import { useEffect, useState } from "react";
import DataTable from "./DataTable.js";
import Skeleton from "@material-ui/lab/Skeleton";
import { Box } from "@material-ui/core";
import AdherentsApiClient from "@lib/client/AdherentsApiClient.js";

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
	virement: "Par Virement",
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
			if (adhesion.statut === "en_attente") {
				return {
					label: "Confirmer Paiement",
					action: async () => {
						if (
							confirm(
								`Confirmez-vous la réception du paiement pour l'adhésion ${adhesion.no} (${adhesion.nom})`
							)
						) {
							const paymentData = {
								date: new Date().toISOString().substr(0, 10),
								montant: 200
							};
							await AdherentsApiClient.confirmAdhesion(
								adhesion.no,
								paymentData
							);
							alert("Le paiement a été enregistré");
						}
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
	const [needsRefresh, setRefresh] = useState(Date.now());

	// Fetch the rows
	useEffect(async () => {
		try {
			console.log(`Fetching adhesions...`);
			setRows((await AdherentsApiClient.retrieveAdhesions()).rows);
		} catch (err) {
			setError(err.message);
		}
	}, [needsRefresh]);

	return rows ? (
		<DataTable
			rows={applyFilter(filter, rows)}
			columns={columns}
			onAction={() => setRefresh(Date.now())}
		/>
	) : error ? (
		<Box className="error">{error}</Box>
	) : (
		<Skeleton width={1200} height={800} />
	);
};

export default AdhesionsDataTable;
