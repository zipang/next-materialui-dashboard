import { useState } from "react";
import AdhesionsDataTable from "@components/tables/AdhesionsDataTable.js";
import AdminDashboard from "./index.js";

const buildTabs = (statut, setFilter) => {
	const tabs = [
		{
			value: "active",
			label: "Adhésions actives",
			action: () => setFilter("active")
		},
		{
			value: "en_attente",
			label: "Paiement en attente",
			action: () => setFilter("en_attente")
		},
		{
			value: "expiree",
			label: "Ancienne adhésions",
			action: () => setFilter("expiree")
		}
	];
	tabs.value = statut; // the currently selected tab
	return tabs;
};

const PageAdhesions = () => {
	const [statut, setFilter] = useState("active");
	return (
		<AdminDashboard title="Adhésions" tabs={buildTabs(statut, setFilter)}>
			<AdhesionsDataTable filter={{ statut }} />
		</AdminDashboard>
	);
};

export default PageAdhesions;
