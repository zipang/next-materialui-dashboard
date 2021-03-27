import { Fab } from "@material-ui/core";
import SvgIcon from "@components/SvgIcon";

/**
 * @typedef ActionButtonProps
 * @field {String} name
 * @field {String} label Texte of the button
 * @field {String} name
 */

/**
 *
 * @param {ActionButtonProps} props
 * @returns
 */
const ActionButton = ({ name = "edit", label = "Edit", ...props }) => (
	<Fab color="primary" className="action" aria-label={label} {...props}>
		<SvgIcon name={name} />
	</Fab>
);

export default ActionButton;
