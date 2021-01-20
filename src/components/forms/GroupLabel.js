import { Box } from "@material-ui/core";

/**
 * Label a group of controls
 * and draw a box around them
 * @param {PropsWithChildren} props
 * @param {String} props.label
 */
const GroupLabel = ({ label = "", children }) => (
	<Box
		margin="1em 0"
		display="flex"
		flexWrap="wrap"
		padding="0.5em"
		border="1px solid #ccc"
	>
		<Box component="label" display="block" width="100%" margin="0.5em">
			{label}
		</Box>
		{children}
	</Box>
);

export default GroupLabel;
