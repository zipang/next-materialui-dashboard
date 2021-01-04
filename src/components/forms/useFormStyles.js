import { makeStyles } from "@material-ui/core/styles";

/**
 * Create specific css class names for our form
 */
const useFormStyles = makeStyles((theme) => ({
	form: {
		height: "100%",
		width: "100%",
		backgroundColor: theme.palette.background.light,
		padding: "1rem",
		marginTop: theme.spacing(1),
		alignItems: "center",
		justify: "center",
		"& input": {
			fontWeight: 800
		},
		"& .submit": {
			margin: theme.spacing(3, 0, 2)
		}
	}
}));

export default useFormStyles;
