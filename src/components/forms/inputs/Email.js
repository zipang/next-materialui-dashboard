import Text from "./Text.js";

/**
 * Text Input with specific email validation
 * @param {InputProps} props
 */
const Email = ({ validation = {}, errorMessage = "Email invalide", ...props }) => {
	const emailValidation = {
		...validation,
		invalidEmail: {
			pattern: /^.+@.+\..+$/,
			message: errorMessage
		}
	};
	return <Text validation={emailValidation} autoComplete={true} {...props} />;
};

export default Email;
