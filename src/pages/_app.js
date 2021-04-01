import AuthenticationProvider from "@components/AuthenticationProvider.js";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../theme.js";
import { NoSsr } from "@material-ui/core";

const MyApp = ({ Component, pageProps }) => {
	// useEffect(() => {
	// 	// Remove the server-side injected CSS.
	// 	const jssStyles = document.querySelector("#jss-server-side");
	// 	if (jssStyles) {
	// 		jssStyles.parentElement.removeChild(jssStyles);
	// 	}
	// }, []);

	return (
		<AuthenticationProvider>
			<NoSsr>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</NoSsr>
		</AuthenticationProvider>
	);
};

export default MyApp;
