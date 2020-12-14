import * as React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import TextsmsIcon from "@material-ui/icons/Textsms";
import TimerIcon from "@material-ui/icons/Timer";
import SettingsIcon from "@material-ui/icons/Settings";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import PieChartIcon from "@material-ui/icons/PieChart";
import SearchIcon from "@material-ui/icons/Search";
import LanguageIcon from "@material-ui/icons/Language";

const categories = [
	{
		id: "Tableaux de bord",
		children: [
			{ id: "Progressions", icon: <ShowChartIcon /> },
			{ id: "Statistiques", icon: <PieChartIcon /> }
		]
	},
	{
		id: "Membres",
		icon: <PeopleIcon />,
		children: [
			{
				id: "Rechercher",
				icon: <SearchIcon />,
				active: true
			},
			{
				id: "Messages",
				icon: <TextsmsIcon />
			}
		]
	},
	{
		id: "Paramètres",
		children: [
			{ id: "Analytics", icon: <SettingsIcon /> },
			{ id: "Langues", icon: <LanguageIcon /> }
		]
	}
];

const useStyles = makeStyles((theme) => ({
	categoryHeader: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	},
	categoryHeaderPrimary: {
		color: theme.palette.common.white
	},
	item: {
		paddingTop: 1,
		paddingBottom: 1,
		color: "rgba(255, 255, 255, 0.7)",
		"&:hover, &:focus": {
			backgroundColor: "rgba(255, 255, 255, 0.08)"
		}
	},
	itemCategory: {
		backgroundColor: "black",

		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	},
	firebase: {
		fontSize: 24,
		color: theme.palette.common.white
	},
	itemActiveItem: {
		color: "#4fc3f7"
	},
	itemPrimary: {
		fontSize: "inherit"
	},
	itemIcon: {
		minWidth: "auto",
		marginRight: theme.spacing(2)
	},
	divider: {
		marginTop: theme.spacing(2)
	}
}));

function Navigator(props) {
	const styles = useStyles();

	return (
		<Drawer variant="permanent" {...props}>
			<List disablePadding>
				<ListItem
					className={clsx(styles.firebase, styles.item, styles.itemCategory)}
				>
					Docusaurus
				</ListItem>

				<Divider className={styles.divider} />
				{categories.map(({ id, children }) => (
					<React.Fragment key={id}>
						<ListItem className={styles.categoryHeader}>
							<ListItemText
								classes={{
									primary: styles.categoryHeaderPrimary
								}}
							>
								{id}
							</ListItemText>
						</ListItem>
						{children.map(({ id: childId, icon, active }) => (
							<ListItem
								key={childId}
								button
								className={clsx(
									styles.item,
									active && styles.itemActiveItem
								)}
							>
								<ListItemIcon className={styles.itemIcon}>
									{icon}
								</ListItemIcon>
								<ListItemText
									classes={{
										primary: styles.itemPrimary
									}}
								>
									{childId}
								</ListItemText>
							</ListItem>
						))}

						<Divider className={styles.divider} />
					</React.Fragment>
				))}
			</List>
		</Drawer>
	);
}

Navigator.propTypes = {};

export default Navigator;
