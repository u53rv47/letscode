import { CircularProgress } from "@mui/material";

export const Loading = (): JSX.Element => {
	return <div style={{
		display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", position: "absolute"
	}}>
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			<CircularProgress />
		</div>
	</div>
}