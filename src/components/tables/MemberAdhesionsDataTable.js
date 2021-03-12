import { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Skeleton from "@material-ui/lab/Skeleton";
import { Box } from "@material-ui/core";
import UsersApiClient from "@lib/client/UsersApiClient";
import { useEventBus } from "@components/EventBusProvider";

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

export const defineColumns = (eb) => [
	{ id: "no", label: "N°", minWidth: 80 },
	{
		id: "nom",
		label: "Adhérent",
		minWidth: 200,
		link: ({ siret }) => `/member/${siret}`
	},
	{
		id: "mode_paiement",
		label: "Mode Paiement",
		minWidth: 80,
		format: (code) => MODE_PAIEMENTS[code],
		button: (adhesion) => {
			if (adhesion.statut === "a_renouveler") {
				return {
					label: "Renouveler Adhésion",
					action: () => eb.send(`adhesion:renew`, adhesion.siret)
				};
			}
		}
	},
	{ id: "date_debut", label: "Date début", minWidth: 100, format: displayDate },
	{ id: "date_fin", label: "Date fin", minWidth: 100, format: displayDate }
];

/**
 * Display the table of adhesions linked to a member
 * @param {*} props
 */
const MemberAdhesionsDataTable = ({ user, adhesions }) => {
	const eb = useEventBus();
	const [rows, setRows] = useState(adhesions);
	const [error, setError] = useState();
	const [needsRefresh, setRefresh] = useState(Date.now());

	eb.on("needsRefresh", () => setRefresh(Date.now()));

	// Fetch the rows
	useEffect(async () => {
		try {
			if (!rows) {
				console.log(`Fetching adhesions...`);
				setRows((await UsersApiClient.getAdhesions(user)).rows);
			}
		} catch (err) {
			setError(err.message);
		}
	}, [needsRefresh]);

	return rows ? (
		<DataTable rows={rows} columns={defineColumns(eb)} />
	) : error ? (
		<Box className="error">{error}</Box>
	) : (
		<Skeleton width={1200} height={800} />
	);
};

export default MemberAdhesionsDataTable;
