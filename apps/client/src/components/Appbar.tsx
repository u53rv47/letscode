import { Typography, Link, Grid } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

function Appbar(): JSX.Element {
	const navigate = useNavigate();
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
					<div onClick={() => {
						navigate("/");
					}}>
						<img src={logo} alt="Let's code" />
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