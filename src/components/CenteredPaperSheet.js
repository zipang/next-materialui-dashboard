import { Grid, Box, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
	background: {
		backgroundColor: "#6c828d",
		margin: 0,
		width: "100%"
	},
	fullPage: {
		minHeight: "100vh"
	},
	fullHeight: {
		height: "100%"
	},
	paper: {
		background: "white",
		display: "grid",
		minHeight: "50vh",
		margin: "auto 10vw"
	}
}));

/**
 * Return a full screen or full height grey background
 * with a (vertically and horizontaly) centered container
 * @param props
 * @param {Boolean} [props.fullPage=true] If true set the height to full screen height
 * @param {Boolean} [props.fullHeight=false] If true set the height to full container height
 * @param {JSX.Element} props.children
 */
const CenteredPaperSheet = ({ fullPage = true, fullHeight = false, children }) => {
	const styles = useStyles();
	return (
		<Grid
			container
			spacing={0}
			alignItems="center"
			justify="center"
			className={clsx(
				styles.background,
				fullPage && styles.fullPage,
				fullHeight && styles.fullHeight
			)}
		>
			<Grid item>
				<Paper square elevation={5} className={styles.paper}>
					{children}
				</Paper>
			</Grid>
		</Grid>
	);
};

export default CenteredPaperSheet;
