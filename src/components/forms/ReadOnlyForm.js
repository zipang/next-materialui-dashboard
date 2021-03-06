import { useEffect } from "react";
import { useEventBus } from "@components/EventBusProvider";
import Tab from "./Tab.js";

/**
 * Find a tab by its index or id
 * @param {Array} tabs
 * @param {Number|String} indexOrID
 */
const getTab = (tabs = [], indexOrID = 0) => {
	if (indexOrID in tabs) {
		return tabs[indexOrID];
	} else {
		return tabs.find((t) => t.id === indexOrID);
	}
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

	useEffect(() => {
		eb.on("tab:change", setCurrentTab);
	}, [false]);

	return new Tab(getTab(tabs, currentTab)).display(data);
};
