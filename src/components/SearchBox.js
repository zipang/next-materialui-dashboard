import * as React from "react";
import {
	AppBar,
	Toolbar,
	Container,
	Paper,
	Grid,
	Typography,
	Button
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
	paper: {
		margin: "auto",
		overflow: "hidden"
	},
	searchBar: {
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
	},
	searchInput: {
		fontSize: theme.typography.fontSize
	},
	block: {
		display: "block"
	},
	addUser: {
		marginRight: theme.spacing(1)
	},
	SearchBoxWrapper: {
		margin: "40px 16px"
	}
}));

function SearchBox(props) {
	const styles = useStyles();

	return (
		<Container>
			<Paper className={styles.paper}>
				<AppBar
					className={styles.searchBar}
					position="static"
					color="default"
					elevation={0}
				>
					<Toolbar>
						<Grid container spacing={2} alignItems="center">
							<Grid item>
								<SearchIcon className={styles.block} color="inherit" />
							</Grid>
							<Grid item xs>
								<TextField
									fullWidth
									placeholder="Recherchez par adresse mail, no de téléphone, nom et prénom"
									InputProps={{
										disableUnderline: true,
										className: styles.searchInput
									}}
								/>
							</Grid>
							<Grid item>
								<Button color="primary" className={styles.addUser}>
									Chercher
								</Button>
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
				<div className={styles.SearchBoxWrapper}>
					<Typography color="textSecondary" align="center">
						Pas de résultats
					</Typography>
				</div>
			</Paper>
		</Container>
	);
}

SearchBox.propTypes = {};

export default SearchBox;
