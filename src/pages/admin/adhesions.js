import { useState } from "react";
import AdhesionsDataTable from "@components/tables/AdhesionsDataTable.js";
import Dashboard from "@components/Dashboard.js";
import { withAuthentication } from "@components/AuthenticationProvider";

const buildTabsDefs = (statut, setFilter) => {
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
		<Dashboard title="Adhésions" tabsDefs={buildTabsDefs(statut, setFilter)}>
			<AdhesionsDataTable filter={{ statut }} />
		</Dashboard>
	);
};

export default withAuthentication(PageAdhesions, {
	profiles: ["admin"],
	loginPage: "/admin/login",
	redirectTo: "/admin/adhesions"
});
