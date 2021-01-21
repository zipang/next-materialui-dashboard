import { Box } from "@material-ui/core";

/**
 * Label a group of controls
 * and draw a box around them
 * @param {PropsWithChildren} props
 * @param {String} props.label
 */
const GroupLabel = ({ label = "", children }) => (
	<Box
		marginTop="0.5em"
		marginBottom="0.5em"
		display="flex"
		flexWrap="wrap"
		flexGrow="1"
		padding="0.5em"
		border="1px solid #ccc"
	>
		<Box component="label" display="block" width="100%" margin="0.1em 0 0.1em 0.5em">
			{label}
		</Box>
		{children}
	</Box>
);

export default GroupLabel;
