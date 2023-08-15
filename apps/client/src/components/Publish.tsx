import { useState } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState, useResetRecoilState } from "recoil";
import { Grid, TextField, Button, TextareaAutosize, Typography } from "@mui/material";
import { problemTitle, problemDescription, problemInputs, problemOutputs, problemDetails } from "../store/selectors/problem";
import axios from "axios";
import { initialProblem } from "../store/atoms/problem";
import TinyMCE from "./publish/TinyMCE";
import IOSet from "./publish/IOSet";


function Publish(): JSX.Element {
	const [title, setTitle] = useRecoilState(problemTitle);
	const [problem, setProblem] = useRecoilState(problemDetails);
	const description = useRecoilValue(problemDescription);

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
					transition: "0.3s",
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
						flexDirection: "column",
						justifyContent: "center",
						margin: "0px 40px"
					}}>
						<IOSet type="Input" state={problemInputs} />
						<br />
						<IOSet type="Output" state={problemOutputs} />
						<br />
						<Typography marginBottom="10px">Sample Testcases</Typography>
						<TextField multiline size="small" minRows={2}></TextField>
						<br />
						<Typography marginBottom="10px">Driver Code</Typography>
						<TextField multiline size="small" minRows={10}></TextField>
					</div>
					<div style={{
						display: "flex",
						justifyContent: "space-between",
						margin: "15px 0px 0px 40px"
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
							style={{
								textTransform: "initial"
							}}
							onClick={() => {
								console.log(problem);
							}}
						> Log me</Button>
						<Button
							size="small"
							variant="contained"
							color="error"
							style={{
								textTransform: "initial"
							}}
							onClick={() => {
								setProblem(initialProblem);
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