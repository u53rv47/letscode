import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Navigate, useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import { Typography, Link, Grid, Box, Button } from "@mui/material";
import logo from "../assets/logo.png"
import { nameState, userDetails } from "../store/selectors/user";
import { useEffect } from "react";
import { initialUser } from "../store/atoms/user";

function Appbar(): JSX.Element {
	const navigate = useNavigate();
	const setUser = useSetRecoilState(userDetails);
	const name = useRecoilValue(nameState);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token)
			axios.get("http://localhost:3000/user/", {
				headers: {
					"Authorization": "Bearer " + token
				}
			})
				.then((res) => {
					console.log("Appbar request:")
					console.log(res)
					setUser(res.data.user);
				});
	}, [])

	return (
		<Grid container style={{
			width: "100%",
			background: "#fff"
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
						{!!name && <div style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: 'center',
							width: "180px"
						}}>
							<Button size="small" variant="outlined" onClick={() => (
								navigate("/publish")
							)} >Publish</Button>

							<div style={{ display: 'flex', background: "#eee", alignItems: "center", padding: "1px 8px", marginLeft: "30px", borderRadius: "50px" }}>
								<AccountCircle color="disabled" fontSize="small" />
								<Typography color="gray" marginLeft="5px">{name.split(' ')[0]}</Typography>
							</div>
							<Button
								size="small"
								sx={{
									marginLeft: "1px",
									borderRadius: "10px",
								}}
								onClick={() => {
									localStorage.removeItem("token");
									setUser(initialUser)
								}}>
								<LogoutIcon color="disabled" fontSize="small" />
							</Button>
						</div>}
						{!name && <Typography paddingRight={2} >
							<Link href="/signin" underline="none">
								Signin/Signup
							</Link>
						</Typography>}
					</div>
				</div >
			</Grid>
			<Grid item lg={2} md={1} sm={0} xs={0} />
		</Grid>
	);
}


export default Appbar;