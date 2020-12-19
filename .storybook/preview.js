import { muiTheme } from "storybook-addon-material-ui";

import theme from "../src/theme";

export const decorators = [muiTheme([theme])];

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	layout: "centered"
};
