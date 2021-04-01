import { Fab } from "@material-ui/core";
import SvgIcon from "@components/SvgIcon.js";

/**
 * @typedef ActionButtonProps
 * @property {String} name
 * @property {String} label Texte of the button
 * @property {String} name
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
