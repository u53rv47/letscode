import { useState } from "react";
import axios from "axios";
import { Card, Typography, Link, TextField, Button, Fade, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userDetails } from "../../store/selectors/user";
import { useSetRecoilState } from "recoil";

function Signin(): JSX.Element {
	const navigate = useNavigate();
	const setUser = useSetRecoilState(userDetails);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [alertVisibility, setAlertVisibility] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');

	return (
		<div style={{
			display: "flex",
			justifyContent: "center",
			marginTop: 120,

		}}>
			<div style={{
				background: "white",
				width: 400
			}}>
				<Card style={{
					padding: 30
				}}>
					<div style={{
						display: "flex",
						justifyContent: "center"
					}}>
						<Typography variant={"h6"} style={{
							marginBottom: 30
						}}>
							Welcome back to Let's code.
						</Typography>
					</div>
					<div>
						{alertVisibility &&
							<div>
								<Fade
									in={alertVisibility}
									timeout={{ enter: 1000, exit: 1000 }}
								>
									<Alert severity="error">{alertMessage}</Alert>
								</Fade>
								<br /><br />
							</div>}
						<TextField
							fullWidth
							label="Email or Username"
							type="username"
							variant="outlined"
							size="small"
							onChange={e => {
								setUsername(e.target.value);
							}}
						/>
						<br /><br />
						<TextField
							fullWidth
							label="Password"
							type="password"
							variant="outlined"
							size="small"
							onChange={e => {
								setPassword(e.target.value);
							}}
						/>
						<br /><br />

						<Button
							fullWidth
							type="submit"
							size="small"
							variant="contained"
							style={{
								textTransform: "initial"
							}}
							onClick={async () => {
								axios.post("http://localhost:3000/user/signin", {
									username,
									password
								})
									.then(res => {
										localStorage.setItem("token", res.data.token);
										localStorage.setItem("name", res.data.user.name);
										setUser(res.data.user);
										navigate("/");
									})
									.catch(e => {
										console.log(e.response.data.message);
										setAlertVisibility(true);
										setAlertMessage(e.response.data.message);
										setTimeout(() => {
											setAlertVisibility(false);
										}, 3000);
									});
							}}
						> Sign in</Button>
						<div style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: 20
						}}>
							<Typography paddingLeft={1} >
								<Link href="/reset-password" underline="none">
									Forgot Password?
								</Link>
							</Typography>
							<Typography paddingRight={1} >
								<Link href="/signup" underline="none">
									New here? Sign up
								</Link>
							</Typography>
						</div>
					</div>
				</Card>
			</div>
		</div>

	)
}

export default Signin;