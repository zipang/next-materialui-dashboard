import React from "react";
import PropTypes from "prop-types";
import AuthenticationProvider from "@components/AuthenticationProvider";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../theme";

const MyApp = ({ Component, pageProps }) => (
	<AuthenticationProvider>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	</AuthenticationProvider>
);

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired
};

export default MyApp;
