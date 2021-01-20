import { Box, Grid } from "@material-ui/core";
import Input from "@forms/Input";
import StepForm from "./StepForm";
import GroupLabel from "./GroupLabel";
import { useEventBus } from "@components/EventBusProvider";
import { useEffect } from "react";

/**
 * @typedef StepDef
 * @param {String} id
 * @param {String} title
 * @param {HelpDef} [help]
 * @param {Array<FieldDef>} [fields]
 * @param {Function} [displayForm] a custom function to display the form without fields
 */

/**
 * @typedef HelpDef
 * @param {String} description
 * @param {String} [backgroundImage]
 */

/**
 * @typedef FieldDef
 * @param {String} name
 * @param {String} label
 * @param {String} type=text|date|integer|percent|mail|url
 * @param {Boolean} required
 * @param {Object} [validation] custom validation rules
 * @param {Function} [displayForm] custom implementation (optional)
 */

/**
 * Creates a step object suitable to use inside StepForm
 * From a flat description of the required fields
 * @param {StepDef} step
 */
function Step({ id, title, help = false, fields = false, displayForm = false }) {
	// Validate that all required fields are provided
	if (!id || !title) {
		throw new TypeError(
			`The 'id' and 'title' fields are both required to create a Step`
		);
	}
	if (!help && !fields && typeof displayForm !== "function") {
		throw new TypeError(
			`You must provide a help section or an array of fields definitions or a custom displayForm method to create the Step ${title}`
		);
	}
	// It's ok : assign all
	Object.assign(this, { id, title, help, fields });
	if (typeof displayForm === "function") {
		this.displayForm = displayForm.bind(this);
	} else if (!fields) {
		// Unable to display anything
		this.displayForm = false;
	}
}

Step.prototype = {
	getBackgroundImageStyle: function () {
		const backgroundImage = this.help?.backgroundImage;
		if (!backgroundImage) {
			return {};
		} else if (backgroundImage.startsWith("http")) {
			return { backgroundImage: `url(${backgroundImage})` };
		} else {
			return { backgroundImage: `url(/img/${backgroundImage})` };
		}
	},
	displayHelp: function (data, errors, onSubmit) {
		if (!this.help) return null;
		const eb = useEventBus();
		const { description } = this.help;
		useEffect(() => {
			if (!this.displayForm) {
				const validate = () => onSubmit({});
				eb.on(`${this.id}:validate`, validate);
				return () => eb.off(`${this.id}:validate`, validate);
			}
		});
		return (
			<div>
				<h2>{this.title}</h2>
				<p>{description}</p>
			</div>
		);
	},
	displayForm: function (data, onSubmit) {
		if (!this.fields) {
			console.log(`Step ${this.id} has no form to display`);
			return null;
		}
		return (
			<StepForm
				formId={`${this.id}`}
				data={data}
				onSubmit={onSubmit}
				rerender={new Date()}
			>
				{!this.help && <h2>{this.description}</h2>}
				<Grid container>{this.displayFields(this.fields)}</Grid>
			</StepForm>
		);
	},
	displayFields: function (fields, startIndex = 0) {
		return fields.map((field, i) => {
			switch (field.type) {
				case "group":
					return this.displayBlock(field, i);

				default:
					const { type = "text", size = 1, ...fieldProps } = field;
					return (
						<Grid item sm={Number(size) * 12} style={{ padding: "0 1em" }}>
							<Input
								key={`${this.id}-input-${i}`}
								type={type}
								autoFocus={i + startIndex === 0}
								{...fieldProps}
							/>
						</Grid>
					);
			}
		});
	},
	displayBlock: function (block, index) {
		return (
			<GroupLabel label={block.label}>
				{this.displayFields(block.fields, index)}
			</GroupLabel>
		);
	}
};

export default Step;
