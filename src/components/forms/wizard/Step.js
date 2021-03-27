import { useEffect } from "react";
import { Grid } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import tim from "@lib/utils/tim";
import breaks from "remark-breaks";
import Input from "@forms/inputs/Input";
import YesNo from "@forms/inputs/YesNo";
import StepForm from "./StepForm";
import GroupLabel from "../GroupLabel";
import { useEventBus } from "@components/EventBusProvider";

/**
 * Register a custom ysn type to render as 2 radio buttons labelled Oui and Non
 */
Input.registerInput("ysn", YesNo("Oui", "Non"));

/**
 * @typedef StepDef
 * @param {String} id
 * @param {String} title
 * @param {HelpDef} [help]
 * @param {Array<FieldDef>} [fields]
 * @param {Function} [displayForm] a custom function to display the form without fields
 * @param {Array} [actions] an optional array of custom actions available to this step
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
 * @param {Boolean|String|Function} required
 * @param {Object} [validation] extra validation rules (will oper on the whole data object)
 * @param {Function} [displayForm] custom implementation (optional)
 */

/**
 * Creates a step object suitable to use inside StepForm
 * From a flat description of the required fields
 * @param {StepDef} step
 */
function Step(
	{ id, title, help = false, fields = false, displayForm = false, validation },
	position = ""
) {
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
	// Extra validation
	if (typeof validation === "function") {
		throw new TypeError(
			`The 'validation' object on a step must be an object containing names validation rules`
		);
	}

	// It's ok : assign all
	Object.assign(this, { id, title, help, fields, validation }, { position });

	// Bind the other methods
	if (typeof displayForm === "function") {
		this.displayForm = displayForm.bind(this);
	} else if (!fields) {
		// Unable to display anything
		this.displayForm = false;
	}
}

const _BACKGROUND_IMAGE_STYLE = {
	backgroundRepeat: "no-repeat",
	backgroundPosition: "bottom",
	backgroundSize: "cover"
};

Step.prototype = {
	getBackgroundImageStyle: function () {
		const style = { ..._BACKGROUND_IMAGE_STYLE, ...this.help };

		if (!style.backgroundImage) {
			return {};
		} else if (style.backgroundImage.startsWith("http")) {
			style.backgroundImage = `url(${style.backgroundImage})`;
		} else {
			style.backgroundImage = `url(/img/${style.backgroundImage})`;
		}
		return style;
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
				<ReactMarkdown plugins={[breaks]}>{tim(description, data)}</ReactMarkdown>
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
				validateStep={this.validation}
				onSubmit={onSubmit}
				customStyles={{ minWidth: "40em" }}
				rerender={new Date()}
			>
				<h2>{`Etape ${this.position}`}</h2>
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
					const {
						type = "text",
						size = 1,
						readOnly = false,
						...fieldProps
					} = field;
					if (readOnly) startIndex--;
					return (
						<Grid
							key={`${field.name}-sizer`}
							item
							sm={Number(size) * 12}
							style={{ padding: "0 0.5em" }}
						>
							<Input
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
			<GroupLabel key={`group-${index}`} label={block.label}>
				{this.displayFields(block.fields, index)}
			</GroupLabel>
		);
	}
};

export default Step;
