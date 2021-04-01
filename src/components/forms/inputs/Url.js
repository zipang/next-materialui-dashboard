import Text from "./Text.js";

/**
 * Text Input with specific url validation
 * @param {InputProps} props
 */
const Url = ({ validation = {}, ...props }) => {
	const urlValidation = {
		...validation,
		validate: {
			invalid: (val) => {
				if (!val) return true;
				try {
					new URL(val);
					return true;
				} catch (err) {
					return "URL invalide";
				}
			}
		}
	};
	return <Text validation={urlValidation} {...props} />;
};

export default Url;
