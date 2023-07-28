import { Grid, Box, Typography } from "@mui/material";

function Editor(): JSX.Element {
	return (
		<div>
			<div style={{
				display: "flex",
				justifyContent: "space-between",
				width: "100vw",
				height: "100vh"
			}}>
				{/* Add a separator attached with editor and Console */}
				<div style={{
					background: "red",
					width: 300,
					height: 600
				}}>Desc</div>
				<div style={{
					display: "grid",
					flexDirection: "column",
					justifyContent: "space-between",
				}}>
					<div style={{
						background: "blue",
						width: 300,
						height: 300
					}}>Editor</div>
					<div style={{
						background: "green",
						width: 300,
						height: 300
					}}>Console</div>
				</div>
			</div>
		</div >
	)
}

export default Editor;