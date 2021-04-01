import { useState } from "react";
import AdherentsDataTable from "@components/tables/AdherentsDataTable.js";
import Dashboard from "@components/Dashboard.js";
import { withAuthentication } from "@components/AuthenticationProvider.js";

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
		<Dashboard title="Adhérents" tabs={buildTabs(statut, setFilter)}>
			<AdherentsDataTable filter={{ statut }} />
		</Dashboard>
	);
};

export default withAuthentication(PageAdherents, {
	profiles: ["admin"],
	loginPage: "/admin/login",
	redirectTo: "/admin/adherents" // There is a quirck here to retrieve the [siret] param
});
