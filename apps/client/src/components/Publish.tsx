import axios from "axios";
import React, { useState } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { Box, Grid, TextField, Button, Typography, Tabs, Tab } from "@mui/material";
import { problemDescription, problemInputs, problemTitle, problemTestcase, problemDriverCode, problemDetails } from "../store/selectors/problem";
import { initialProblem } from "../store/atoms/problem";
import TinyMCE from "./publish/TinyMCE";
import Inputs from "./publish/Inputs";


function Publish(): JSX.Element {
	const setProblem = useSetRecoilState(problemDetails);

	const problem = localStorage.getItem("problem");
	if (problem)
		setProblem(JSON.parse(problem));

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
					<Title />
					{/* <SlateRichText /> */}
					<TinyMCE />
					<div style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						margin: "0px 40px"
					}}>
						<Typography >Inputs</Typography>
						<Inputs />
						<br />
						<Typography marginBottom="10px">Sample Testcases</Typography>
						<Testcase />
						<br />
						<Typography marginBottom="0px">Driver Code</Typography>
						<DriverCode />
					</div>
					<SubmitPanel />
				</div>

			</Grid>
			<Grid item lg={3} md={1} sm={0} xs={0} />
		</Grid>
	)
}

function Title(): JSX.Element {
	const [title, setTitle] = useRecoilState(problemTitle);

	return (
		<TextField
			fullWidth={true}
			label="Title"
			variant="standard"
			size="small"
			inputProps={{ style: { fontSize: 24 } }}
			value={title}
			onChange={(e) => {
				setTitle(e.target.value)
			}}
		/>
	)
}

function Testcase(): JSX.Element {
	const [testcase, setTestcase] = useRecoilState(problemTestcase);

	return (
		<TextField multiline size="small" minRows={2} value={testcase} onChange={e => {
			setTestcase(e.target.value);
		}}></TextField>
	)
}
function DriverCode(): JSX.Element {
	const [tab, setTab] = React.useState(0);
	const [driverCode, setDriverCode] = useRecoilState(problemDriverCode);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};
	return (
		<div style={{
			marginTop: "0px"
		}}>
			<div>
				<Tabs value={tab}
					onChange={handleTabChange}
					aria-label="basic tabs example"
				>
					<Tab sx={{ textTransform: "none" }} label="Java" {...a11yProps(0)} />
					<Tab sx={{ textTransform: "none" }} label="Python" {...a11yProps(1)} />
					<Tab sx={{ textTransform: "none" }} label="JavaScript" {...a11yProps(2)} />
				</Tabs>
			</div>
			<div style={{
				width: '100%', overflow: "auto"
			}}>
				<CustomTabPanel value={tab} index={0}>
					<TextField multiline fullWidth size="small" minRows={10} value={driverCode.java.value}
						onChange={(e) => {
							const newDriverCode = {
								"java": {
									language: 'java',
									value: e.target.value
								},
								"python": driverCode.python,
								"javascript": driverCode.javascript
							};
							setDriverCode(newDriverCode);
						}}></TextField>
				</CustomTabPanel>
				<CustomTabPanel value={tab} index={1} >
					<TextField multiline fullWidth size="small" minRows={10} value={driverCode.python.value}
						onChange={(e) => {
							const newDriverCode = {
								"java": driverCode.java,
								"python": { language: "python", value: e.target.value },
								"javascript": driverCode.javascript
							};
							setDriverCode(newDriverCode);
						}}></TextField>				</CustomTabPanel>
				<CustomTabPanel value={tab} index={2}>
					<TextField multiline fullWidth size="small" minRows={10} value={driverCode.javascript.value}
						onChange={(e) => {
							const newDriverCode = {
								"java": driverCode.java,
								"python": driverCode.python,
								"javascript": {
									language: 'javascript',
									value: e.target.value
								}
							};
							setDriverCode(newDriverCode);
						}}></TextField>
				</CustomTabPanel>
			</div>
		</div>

	)
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{
					padding: "5px 10px 5px 10px",
					// border: "2px solid rgba(0, 0, 0, 0.08)", borderRadius: "5px"
				}}>
					{children}
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function SubmitPanel(): JSX.Element {
	const [problem, setProblem] = useRecoilState(problemDetails);
	return (
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
			// onClick={async () => {

			// 	const res = await axios.post("http://localhost:3000/problem/publish", {
			// 		problem
			// 	}, {
			// 		headers: {
			// 			"Authorization": "Bearer " + localStorage.getItem("token")
			// 		}
			// 	});
			// 	if (res) {
			// 		console.log(title);
			// 		console.log(description);
			// 	}
			// }}
			>Publish</Button>
			<Button
				size="small"
				variant="contained"
				style={{
					textTransform: "initial"
				}}
				onClick={() => {
					console.log(problem)
					localStorage.setItem("problem", JSON.stringify(problem))
				}}
			>Save</Button>
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
			>Reset</Button>
		</div>
	)
}
export default Publish;