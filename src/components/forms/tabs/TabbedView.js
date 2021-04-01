import { useState, useEffect } from "react";
import { useEventBus } from "@components/EventBusProvider";
import { Tab as MuiTab, Tabs as MuiTabs } from "@material-ui/core";
import DisplayTab from "./DisplayTab";
import EditableTab from "./EditableTab";

/**
 * @typedef TabsDef
 * @property {String} value
 * @property {String} label
 * @property {Function} action
 */

/**
 * Take a wizard steps and transform every step into a Tabs Definition
 * @param {Array<StepDef>} steps
 * @param {EventBus} eb
 * @param {Function} setCurrentTab
 * @returns {Array<TabsDef>}
 */
export const buildTabHeaders = (steps, eb, setCurrentTab) =>
	steps.map((t) => ({
		value: t.id,
		label: t.title,
		action: () => {
			eb.emit("tab:change", t.id);
			setCurrentTab(t.id);
		}
	}));

/**
 * @typedef TabsProps
 * @property {Array<TabsDef>} tabsDefs
 * @property {String|Integer} currentTab
 */

/**
 * Display tabs from an array of tabs definition
 * That communicate their state by sending a tab:change event
 * @param {TabsProps}
 * @returns
 */
export const Tabs = ({ tabsDefs = [], currentTab }) => (
	<MuiTabs
		value={tabsDefs.value || currentTab}
		textColor="inherit"
		variant="scrollable"
		scrollButtons="auto"
	>
		{tabsDefs.map(({ label, action, value }, i) => (
			<MuiTab
				key={`dashboard-tab-${i}`}
				label={label}
				onClick={action}
				value={value}
			/>
		))}
	</MuiTabs>
);

/**
 * Displays the sync-ed tab content in edit-mode or read-only
 * @param {TabbedViewProps} props
 * @returns
 */
export const TabbedView = ({ steps, data, editMode, error }) => {
	const [currentTab, setCurrentTab] = useState(0);
	const eb = useEventBus();

	useEffect(() => {
		eb && eb.on("tab:change", setCurrentTab);
	}, [false]);

	if (error) return <strong>{error}</strong>;
	if (data) {
		return editMode ? (
			<EditableTab steps={steps} data={data} currentTab={currentTab} />
		) : (
			<DisplayTab steps={steps} data={data} currentTab={currentTab} />
		);
	}
	return null;
};

export default TabbedView;
