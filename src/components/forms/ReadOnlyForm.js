import { useEffect, useState } from "react";
import { useEventBus } from "@components/EventBusProvider";
import Tab from "./Tab.js";

/**
 * Find a tab by its index or id
 * @param {Array} tabs
 * @param {Number|String} indexOrID
 * @return {Tab}
 */
const getTab = (tabs = [], indexOrID = 0) => {
	const tabDef =
		indexOrID in tabs ? tabs[indexOrID] : tabs.find((t) => t.id === indexOrID);
	console.log(`getTab(${indexOrID}) => `, tabDef);
	return new Tab(tabDef);
};

/**
 * @typedef ReadOnlyFormProps
 * @field {Array<TabDef>} tabs
 * @field {Object} data
 */
/**
 * Display (in read-only mode) one tab of structured data
 * Similar to StepForm that displays fields in a step but READ-ONLY !
 * @param {ReadOnlyFormProps} props
 */
const ReadOnlyForm = ({ tabs = [], data = {} }) => {
	const [currentTab, setCurrentTab] = useState(0);
	const eb = useEventBus();
	console.log("Displaying read-only form", data);

	useEffect(() => {
		eb && eb.on("tab:change", setCurrentTab);
	}, [false]);

	return getTab(tabs, currentTab).display(data);
};

export default ReadOnlyForm;
