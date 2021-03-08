import { useState } from "react";
import AdherentsDataTable from "@components/tables/AdherentsDataTable.js";
import AdminDashboard from "./index.js";

const buildTabs = (statut, setFilter) => {
	const tabs = [
		{
			value: "actif",
			label: "Adhérents actifs",
			action: () => setFilter("actif")
		},
		{
			value: "en_attente",
			label: "En attente",
			action: () => setFilter("en_attente")
		},
		{
			value: "inactif",
			label: "Adhérents inactifs",
			action: () => setFilter("inactif")
		}
	];
	tabs.value = statut; // the currently selected tab
	return tabs;
};

/**
 * Display the list of all adherents, with a filter on their status
 */
const PageAdherents = () => {
	const [statut, setFilter] = useState("actif");
	return (
		<AdminDashboard title="Adhérents" tabs={buildTabs(statut, setFilter)}>
			<AdherentsDataTable filter={{ statut }} />
		</AdminDashboard>
	);
};

export default PageAdherents;
