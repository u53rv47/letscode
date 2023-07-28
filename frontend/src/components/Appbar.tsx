import { Typography, Link, Grid } from "@mui/material";


function Appbar(): JSX.Element {
	return (
		<Grid container style={{
			background: "#ffffff"
		}}>
			<Grid item lg={2} md={1} sm={0} xs={0} />
			<Grid item lg={8} md={10} sm={12} xs={12}>
				<div style={{
					display: "flex",
					justifyContent: "space-between",
				}}>
					<div>
						<Typography variant={"h6"} paddingLeft={2}>Let's code</Typography>
					</div>
					<div>
						<Typography paddingRight={2} >
							<Link href="/signin" underline="none">
								Signin/Signup
							</Link>
						</Typography>
					</div>
				</div >
			</Grid>
			<Grid item lg={2} md={1} sm={0} xs={0} />
		</Grid>

	);
}


export default Appbar;