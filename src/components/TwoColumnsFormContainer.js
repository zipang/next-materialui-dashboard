import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	twoColumnsContainer: {
		height: "100%",
		minHeight: "80vh",
		minWidth: "1024px",
		width: "60vw",
		"& .image": {
			backgroundColor: "blue",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			backgroundPosition: "right"
		},
		"& .form": {
			height: "100%",
			padding: theme.spacing(8, 4),
			display: "flex",
			flexDirection: "column",
			alignItems: "center"
		},
		"& form": {
			width: "100%"
		}
	}
}));

/**
 * Affiche un formulaire en regard d'une illustration
 * @param props
 * @param {String} props.image Image source for the background of the first column
 */
const TwoColumnsFormContainer = ({ image, children }) => {
	const styles = useStyles();

	return (
		<Grid container className={styles.twoColumnsContainer} spacing={0}>
			<Grid
				item
				className="image"
				xs={false}
				md={6}
				xl={7}
				style={{ backgroundImage: `url(${image})` }}
			></Grid>
			<Grid item className="form" xs={12} md={6} xl={5}>
				{children}
			</Grid>
		</Grid>
	);
};

export default TwoColumnsFormContainer;
