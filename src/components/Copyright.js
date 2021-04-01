import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "./Link.js";

const Copyright = () => (
	<Typography component="p" variant="caption" color="textSecondary" align="center">
		{"Copyright © "}
		<Link color="inherit" href={`${process.env.NEXT_PUBLIC_SITE_URL}`}>
			{`${process.env.NEXT_PUBLIC_SITE_NAME}`}
		</Link>
		&nbsp;
		{new Date().getFullYear()}.
	</Typography>
);

export default Copyright;
