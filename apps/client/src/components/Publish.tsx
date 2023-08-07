import { useState } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { Grid, TextField, Button, Box } from "@mui/material";
import { problemTitle, problemDescription, problemDetails } from "../store/selectors/problem";
import axios from "axios";
import { initialValue, problemState } from "../store/atoms/problem";
import TinyMCE from "./publish/TinyMCE";

function Publish(): JSX.Element {
	const [title, setTitle] = useRecoilState(problemTitle);
	const [description, setDescription] = useRecoilState(problemDescription);


	return (
		<Grid container style={{
			background: "#eee",
			marginTop: 50
		}}>
			<Grid item lg={3} md={1} sm={0} xs={0} />
			<Grid item lg={6} md={10} sm={12} xs={12}>
				<div style={{
					background: "#fff",
					padding: 10,
					borderRadius: 5,
					boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
					transition: "0.3s"

				}}>
					<TextField
						fullWidth={true}
						label="Title"
						variant="standard"
						size="small"
						value={title}
						inputProps={{ style: { fontSize: 24 } }}
						onChange={e => {
							setTitle(e.target.value);
						}}
					/>
					{/* <SlateRichText /> */}
					<TinyMCE />

					<div style={{
						display: "flex",
						justifyContent: "space-between"
					}}>
						<Button
							size="small"
							variant="contained"
							style={{
								textTransform: "initial"
							}}
							onClick={async () => {
								const res = await axios.post("http://localhost:3000/problem/publish", {
									title,
									description
								}, {
									headers: {
										"Authorization": "Bearer " + localStorage.getItem("token")
									}
								});
								if (res) {
									console.log(title);
									console.log(description);
								}
							}}
						> Publish</Button>
						<Button
							size="small"
							variant="contained"
							color="error"
							style={{
								textTransform: "initial"
							}}
							onClick={() => {
								setTitle("");
								setDescription(initialValue);
								console.log(title);
								console.log(description);
							}}
						> Reset</Button>
					</div>
				</div>

			</Grid>
			<Grid item lg={3} md={1} sm={0} xs={0} />
		</Grid>
	)
}

export default Publish;