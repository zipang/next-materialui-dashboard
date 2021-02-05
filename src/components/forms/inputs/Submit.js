import { Button } from "@material-ui/core";

/**
 * @typedef SubmitProps
 * @field {String} [label="OK"]
 */

/**
 * A simple, primary submit button
 * @param {SubmitProps} props
 */
const Submit = ({ label = "OK", ...moreProps }) => (
	<Button
		type="submit"
		fullWidth
		variant="contained"
		color="primary"
		className="submit"
		{...moreProps}
	>
		{label}
	</Button>
);

export default Submit;
