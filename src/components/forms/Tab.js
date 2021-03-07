import { Grid } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import StepForm from "./StepForm";
import GroupLabel from "./GroupLabel";
import Link from "@components/Link";
import { getProperty } from "@lib/utils/NestedObjects";

/**
 * @typedef TabDef
 * @param {String} id
 * @param {Array<FieldDef>} fields
 */

/**
 * @typedef FieldDef
 * @param {String} name
 * @param {String} label
 * @param {String} type=text|date|integer|percent|mail|url
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
			case "ysn":
				return value ? "Oui" : "Non";

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
							<strong>{field.label}&nbsp;:&nbsp;</strong>&nbsp;
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
	}
};

export default Tab;
