import { Box } from "@material-ui/core";

/**
 * Affiche un formulaire en regard d'une illustration
 * @param props
 * @param {String} props.image Image source for the background of the first column
 */
const TwoColumnsFormContainer = ({ image, children }) => (
	<Box display="flex" minWidth={[0.9, 0.9, 0.8, 1024]} minHeight={"450px"} flexGrow={1}>
		<Box width={[0, 0, 0, 1]} style={{ backgroundImage: `url(${image})` }}></Box>
		<Box
			padding="4rem 2rem"
			minWidth={[1, 1, 0.6, "640px"]}
			minWidth={[0, 0, 0, "640px"]}
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			{children}
		</Box>
	</Box>
);

export default TwoColumnsFormContainer;
