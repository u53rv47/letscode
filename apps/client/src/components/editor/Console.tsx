import { MoreHoriz } from "@mui/icons-material";
import { Grid, Box, Typography } from "@mui/material";
import React from "react";

const Console = React.forwardRef(function (props, refHorizontal): JSX.Element {

	return (
		<div style={{
			height: "100%",
			borderRadius: "10px",
			paddingLeft: "10px",
			background: "#000",
			overflow: "auto"
		}}
		>Console</div>
	)
});


export default Console;