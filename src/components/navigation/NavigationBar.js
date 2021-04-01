import * as React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import adminNavigationItems from "@config/adminNavigationItems.json";
import memberNavigationItems from "@config/memberNavigationItems.json";

import Link from "next/link";
import User from "@models/User.js";
import SvgIcon from "@components/SvgIcon.js";

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

/**
 * Titre d'un bloc de navigation
 */
const NavLinkHeader = ({ styles, label }) => (
	<ListItem className={styles.categoryHeader} key={label}>
		<ListItemText
			classes={{
				primary: styles.categoryHeaderPrimary
			}}
		>
			{label}
		</ListItemText>
	</ListItem>
);

/**
 * Lien de navigation dans le menu de gauche
 */
const NavLink = ({ label, icon, action, selectedNav, styles }) => (
	<Link key={label} href={action}>
		<ListItem
			button
			className={clsx(styles.item, action === selectedNav && styles.itemActiveItem)}
		>
			<ListItemIcon className={styles.itemIcon}>
				<SvgIcon name={icon} />
			</ListItemIcon>
			<ListItemText
				classes={{
					primary: styles.itemPrimary
				}}
			>
				{label}
			</ListItemText>
		</ListItem>
	</Link>
);

/**
 * Le menu de navigation vertical
 * @param {Object} props
 */
export const NavigationBar = ({ navigationEntries, selectedNav }) => {
	const styles = useStyles();

	return (
		<Drawer variant="permanent" PaperProps={{ style: { width: 256 } }}>
			<List disablePadding>
				<ListItem
					key="first"
					className={clsx(styles.firebase, styles.item, styles.itemCategory)}
				>
					INVIE
				</ListItem>

				<Divider key="second" className={styles.divider} />

				{navigationEntries.map(({ label, children }, i) => (
					<>
						<NavLinkHeader
							key={`nav-link-header-${i}`}
							styles={styles}
							label={label}
						/>

						{children.map(({ ...linkProps }, i) => (
							<NavLink
								styles={styles}
								selectedNav={selectedNav}
								key={`nav-link-${i}`}
								{...linkProps}
							/>
						))}
						<Divider className={styles.divider} key={`divider-${i}`} />
					</>
				))}
			</List>
		</Drawer>
	);
};

/**
 * Affiche la barre de navigation liée au profil de l'utilisateur
 * (admin ou membre)
 * @param {Props} props
 * @param {User} user logged User
 */
const UserNavBar = ({ user, selectedNav }) => (
	<NavigationBar
		selectedNav={selectedNav}
		navigationEntries={user.isAdmin() ? adminNavigationItems : memberNavigationItems}
	/>
);

export default UserNavBar;
