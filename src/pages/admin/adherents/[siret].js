import { useState } from "react";
import AdminDashboard from "./index.js";

const defineTabs = (tabDefs, setTab) =>
	tabDefs.map((t) => ({
		value: t.id,
		label: t.title,
		action: () => setTab(t.id)
	}));

/**
 * Display the detail of an adherent using multiple tabs
 * to organize the data
 */
const PageDetailAdherent = () => {
	const [currentTab, setCurrentTab] = useState(0);

	return <AdminDashboard tabs={defineTabs(currentTab, setCurrentTab)}></AdminDashboard>;
};

export default PageDetailAdherent;
