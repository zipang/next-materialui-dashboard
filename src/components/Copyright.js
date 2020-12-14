import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "./Link";

const Copyright = () => (
	<Typography component="p" variant="caption" color="textSecondary" align="center">
		{"Copyright © "}
		<Link color="inherit" href="https://mtl.com/">
			CML
		</Link>
		&nbsp;
		{new Date().getFullYear()}.
	</Typography>
);

export default Copyright;
