const { Box } = require("@material-ui/core");

/**
 * @typedef CenterProps
 * @param {Boolean} [centerVertically=true]
 * @param {Boolean} [centerHorizontally=true]
 * @param {Boolean} [autoExpand=true]
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
	children
}) => (
	<Box
		display="flex"
		flexDirection="columns"
		flexGrow={autoExpand ? 1 : 0}
		alignItems={centerVertically}
		justifyContent={centerHorizontally}
	>
		{children}
	</Box>
);

export default Center;
