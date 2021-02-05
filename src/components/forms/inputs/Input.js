import Text from "./Text";
import Formatted from "./Formatted";
import Integer from "./Integer";
import Decimal from "./Decimal";
import Date from "./Date";
import Percent from "./Percent";
import CheckBoxes from "./CheckBoxes";
import SelectBox from "./SelectBox";
import Switch from "./Switch";
import Radio from "./Radio";
import Tel from "./Tel";
import Email from "./Email";
import Url from "./Url";

const customInputs = {};

const Input = ({ type, ...fieldProps }) => {
	switch (type) {
		case "text":
			return <Text {...fieldProps} />;
		case "switch":
			return <Switch {...fieldProps} />;
		case "checkboxes":
			return <CheckBoxes {...fieldProps} />;
		case "radio":
			return <Radio {...fieldProps} />;
		case "select":
			return <SelectBox {...fieldProps} />;
		case "date":
			return <Date {...fieldProps} />;
		case "integer":
			return <Integer {...fieldProps} />;
		case "decimal":
			return <Decimal {...fieldProps} />;
		case "percent":
			return <Percent {...fieldProps} />;
		case "email":
			return <Email {...fieldProps} />;
		case "tel":
			return <Tel {...fieldProps} />;
		case "url":
			return <Url {...fieldProps} />;
		case "formatted":
			return <Formatted {...fieldProps} />;

		default:
			if (customInputs[type]) {
				return customInputs[type]({ ...fieldProps });
			} else {
				return <Text {...fieldProps} />;
			}
	}
};

/**
 * Register a custom input to render them using a specific key
 * <Input type="custom" {...props} />
 * @param {String} key The custom type value to register
 * @param {Function} render
 */
Input.registerInput = (name, render) => {
	customInputs[name] = render;
};

export default Input;
