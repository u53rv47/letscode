import { useState } from "react";
import axios from "axios";
import { Card, Typography, Link, TextField, Button, Fade, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { nameState } from "../../store/selectors/user";

function Signup(): JSX.Element {
	const navigate = useNavigate()
	const [name, setName] = useRecoilState(nameState);
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
							Welcome to Let's code.
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
							fullWidth={true}
							label="Name"
							variant="outlined"
							size="small"
							onChange={e => {
								setName(e.target.value);
							}}
						/>
						<br /><br />
						<TextField
							fullWidth={true}
							label="Email or Username"
							variant="outlined"
							size="small"
							onChange={e => {
								setUsername(e.target.value);
							}}
						/>
						<br /><br />
						<TextField
							fullWidth={true}
							label="Password"
							variant="outlined"
							type={"password"}
							size="small"
							onChange={e => {
								setPassword(e.target.value);
							}}
						/>
						<br /><br />

						<Button
							fullWidth={true}
							size="small"
							variant="contained"
							style={{
								textTransform: "initial"
							}}
							onClick={() => {
								axios.post("http://localhost:3000/user/signup", {
									name,
									username,
									password
								})
									.then(res => {
										localStorage.setItem("token", res.data.token);
										setName(res.data.name);
										navigate(-2);
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
						> Sign up</Button>
						<div style={{
							display: "flex",
							justifyContent: "center"
						}}>
							<Typography paddingLeft={1} marginTop={2} >
								<Link href="/signin" underline="none">
									Already an account? Sign in
								</Link>
							</Typography>
						</div>
					</div>
				</Card>
			</div>
		</div>

	)
}

export default Signup;