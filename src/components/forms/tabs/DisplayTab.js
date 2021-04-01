import { Grid } from "@material-ui/core";
import GroupLabel from "../GroupLabel.js";
import Link from "@components/Link.js";
import { getProperty } from "@lib/utils/NestedObjects.js";
import { displaySelectedOption } from "../inputs/utils.js";

/**
 * @typedef TabDef
 * @property {String} id
 * @property {Array<FieldDef>} fields
 */

/**
 * @typedef FieldDef
 * @property {String} name
 * @property {String} label
 * @property {String} type=text|date|integer|percent|mail|ysn|select|checkboxes
 */

/**
 * Tab is a read-only version of the Step used in the Wizard form
 * It's purpose is only to render the data with the same logic of grouping
 * fields together inside a grid layout
 * @param {TabDef} step
 */
function Tab({ id, title, fields }) {
	// Validate that all required fields are provided
	if (!id || !title || !fields) {
		throw new TypeError(
			`The 'id', 'title' and 'fields' are all required to create a Tab`
		);
	}
	// It's ok : assign all
	Object.assign(this, { id, title, fields });
}

Tab.prototype = {
	formatFieldValue: function (field, value) {
		if (!value && value !== 0) return "";
		switch (field.type) {
			case "text":
			case "mail":
				return value;
			case "url":
				return <Link href={value}>{value}</Link>;
			case "date":
				const [y, m, d] = value.split("-");
				return [d, m, y].join("/");
			case "integer":
				return value;
			case "percent":
				return value + "%";
			case "select":
				return displaySelectedOption(value, field.options);
			case "checkboxes":
				return value.map((code) => field.options[code]).join(", ");
			case "ysn":
				return value ? "Oui" : "Non";
			case "radio":
				return !field.label ? null : field.options[value];

			default:
				return value;
		}
	},
	display: function (data) {
		return <Grid container>{this.displayFields(this.fields, data)}</Grid>;
	},
	displayFields: function (fields, data) {
		return fields.map((field, i) => {
			switch (field.type) {
				case "group":
					return this.displayBlock(field, data);

				default:
					return (
						<Grid
							key={`${field.name}-sizer`}
							item
							sm={Number(field.size || 1) * 12}
							style={{ padding: "0 0.5em" }}
						>
							{this.displayFieldLabel(field)}
							{this.formatFieldValue(
								field,
								getProperty(data, field.name, "")
							)}
						</Grid>
					);
			}
		});
	},
	displayBlock: function (block, data) {
		return (
			<GroupLabel
				labelInside={false}
				key={`group-${block.label}`}
				label={block.label}
			>
				{this.displayFields(block.fields, data)}
			</GroupLabel>
		);
	},
	displayFieldLabel: function (field) {
		if (field.label) {
			return <strong>{field.label}&nbsp;:&nbsp;</strong>;
		} else {
			return null;
		}
	}
};

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

const emptyCertification = (stepId) => (field) => {
	if (
		stepId === "step-certifications" &&
		field.type === "group" &&
		field.fields[0].value === "N"
	) {
		// Does this group have a NO
		return false;
	}
	return true; // ok
};

const buildTabsDef = (steps) =>
	steps.map(({ id, title, fields }) => ({
		id,
		title,
		fields: fields
			.map(({ name, label, type = "text", options, size = 1, fields }) => ({
				name,
				label,
				type,
				options,
				size: type === "group" ? 1 : size,
				fields
			}))
			.filter((field) => field.type != "radio")
			.filter(emptyCertification(id))
	}));

/**
 * @typedef ReadOnlyFormProps
 * @property {Array<TabDef>} tabs
 * @property {Object} data
 */
/**
 * Display (in read-only mode) one tab of structured data
 * Similar to StepForm that displays fields in a step but READ-ONLY !
 * @param {ReadOnlyFormProps} props
 */
const DisplayTab = ({ steps = [], data = {}, currentTab = 0 }) => {
	const tabsDef = buildTabsDef(steps);
	return getTab(tabsDef, currentTab).display(data);
};

export default DisplayTab;
