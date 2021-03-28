import { Box } from "@material-ui/core";

/**
 * @typedef CenterProps
 * @property {Boolean} [centerVertically=true]
 * @property {Boolean} [centerHorizontally=true]
 * @property {Boolean} [autoExpand=true]
 */

/**
 * Allow to quicky have a container that auto-expand
 * and center its children
 * @param {CenterProps} props
 */
const Center = ({
	centerVertically = true,
	centerHorizontally = true,
	autoExpand = true,
	children,
	...props
}) => (
	<Box
		display="flex"
		flexDirection="columns"
		flexGrow={autoExpand ? 1 : 0}
		justifyItems={centerHorizontally ? "center" : "flex-start"}
		justifyContent={centerHorizontally ? "center" : "flex-start"}
		{...props}
	>
		{children}
	</Box>
);

export default Center;
