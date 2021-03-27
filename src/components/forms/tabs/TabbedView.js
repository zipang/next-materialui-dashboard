import { useState, useEffect } from "react";
import { useEventBus } from "@components/EventBusProvider";
import DisplayTab from "./DisplayTab";
import EditableTab from "./EditableTab";

/**
 *
 * @param {Array<StepDef>} steps
 * @param {EventBus} eb
 * @param {Function} setCurrentTab
 * @returns {Array}
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
 *
 * @param {*} param0
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
