import Business from "@material-ui/icons/Business";
import CardMembership from "@material-ui/icons/CardMembership";
import Home from "@material-ui/icons/Home";
import People from "@material-ui/icons/People";
import User from "@material-ui/icons/VerifiedUser";
import Timer from "@material-ui/icons/Timer";
import Settings from "@material-ui/icons/Settings";
import ShowChart from "@material-ui/icons/ShowChart";
import Search from "@material-ui/icons/Search";
import Help from "@material-ui/icons/Help";
import Save from "@material-ui/icons/Save";

const iconMap = {
	Business,
	CardMembership,
	Home,
	Help,
	People,
	Save,
	Settings,
	Search,
	ShowChart,
	Timer,
	User
};

export const names = [
	"Business",
	"Home",
	"Help",
	"People",
	"Save",
	"Settings",
	"Search",
	"ShowChart",
	"Timer",
	"User"
];

/**
 * SvgIcon wrapper
 * @param {Object} props
 * @param {String} props.name Name of the Icon to load
 */
const SvgIcon = ({ name, ...props }) => {
	const Icon = iconMap[name] || Help; // Help = not found
	return <Icon {...props} />;
};

export default SvgIcon;
