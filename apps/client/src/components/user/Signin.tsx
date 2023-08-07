import { useState } from "react";
import axios from "axios";
import { Card, Typography, Link, TextField, Button } from "@mui/material";

function Signin(): JSX.Element {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
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
							onClick={async () => {
								const res = await axios.post("http://localhost:3000/user/signin", {
									username,
									password
								});
								if (res) {
									localStorage.setItem("token", res.data.token);
								}
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