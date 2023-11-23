import axios from "axios";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Grid, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Input } from "@mui/material";
import { problemTitle, problemTestcase, problemDetails, problemDifficulty } from "../store/selectors/problem";
import { fileState, initialProblem, problemState } from "../store/atoms/problem";

import TinyMCE from "./publish/TinyMCE";
import Inputs from "./publish/Inputs";
import DriverCode from "./publish/DriverCode";
import { useNavigate, useParams } from "react-router-dom";
import { initialInputs } from "../store/atoms/problem";
import { nameState, userDetails } from "../store/selectors/user";


function Edit(): JSX.Element {
	const { slug } = useParams();
	const setProblem = useSetRecoilState(problemState);

	useEffect(() => {
		// Don't need token as Edit Button won't be visible
		const savedProblem = localStorage.getItem("problem");
		if (savedProblem)
			setProblem(JSON.parse(savedProblem));
		else
			axios.get(`http://localhost:3000/problem/${slug}`, {
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("token")
				}
			}).then(res => {
				const inputs = res.data.inputs.reduce((inputs, curr, index) => {
					const input = { name: curr.name, type: curr.type, add: false }
					inputs.push(input)
					return inputs;
				}, [])
				inputs.push(initialInputs);

				const problem = { title: res.data.title, difficulty: res.data.difficulty, description: res.data.description, inputs, testcase: res.data.testcase, driverCode: res.data.driverCode }
				setProblem({ isLoading: false, problem });
				console.log("Response(Edit)")
				console.log(res.data)
			})
				.catch(e => {
					setProblem({ isLoading: false, problem: initialProblem });
				});
	}, []);

	return (
		<Grid container style={{
			marginTop: 50,
			paddingBottom: 20,
			background: "#eee",
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
					<FileUpload />
					<SubmitPanel />
				</div>
			</Grid>
			<Grid item lg={3} md={1} sm={0} xs={0} />
		</Grid>
	)
}

function Title(): JSX.Element {
	const [title, setTitle] = useRecoilState(problemTitle);
	const [difficuylty, setDifficulty] = useRecoilState(problemDifficulty);

	return (
		<div style={{
			display: "flex",
			justifyContent: "space-between",
			alignItems: "baseline"
		}}>
			<TextField
				style={{
					width: "520px"
				}}
				label="Title"
				variant="standard"
				size="small"
				inputProps={{ style: { fontSize: 24, } }}
				value={title}
				onChange={(e) => {
					setTitle(e.target.value)
				}}
			/>
			<FormControl size='small' style={{
				width: "200px",
			}}>
				<InputLabel>Difficulty</InputLabel>
				<Select
					value={difficuylty}
					label="Difficulty"
					onChange={(e) => {
						setDifficulty(e.target.value)
					}}>
					<MenuItem value="easy">Easy</MenuItem>
					<MenuItem value="medium">Medium</MenuItem>
					<MenuItem value="hard">Hard</MenuItem>
				</Select>
			</FormControl>
		</div>

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

function FileUpload(): JSX.Element {
	const setFiles = useSetRecoilState(fileState);
	return (
		<div style={{
			display: "flex",
			justifyContent: "space-between",
			margin: "15px 40px 20px 40px",
		}}>
			<div style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center"

			}}>
				<Typography fontSize={18} >Testcase & Output:</Typography>
				<div style={{
					width: "220px",
					marginLeft: "10px"
				}}>
					<input type="file"
						multiple
						onChange={(event) => {
							const files = event.target.files;
							if (files) {
								setFiles(Array.from(files));
								console.log(files[0].name)
								console.log(files[1].name)
							}
						}}></input>
				</div>
			</div>
		</div>
	); 3
}

function SubmitPanel(): JSX.Element {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [problem, setProblem] = useRecoilState(problemDetails);
	const [files, setFiles] = useRecoilState(fileState);
	return (
		<div style={{
			display: "flex",
			justifyContent: "space-between",
			margin: "15px 0px 0px 40px"
		}}>
			<div style={{
				width: "150px",
				display: "flex",
				justifyContent: "space-between"
			}}>
				<Button
					size="small"
					variant="contained"
					style={{
						textTransform: "initial"
					}}
					onClick={() => {
						console.log(problem)
						// refine the inputs
						const n = problem.inputs.length;
						const inputs = problem.inputs.reduce((inputs, curr, index) => {
							if (index != n - 1) {
								const input = { name: curr.name, type: curr.type }
								inputs.push(input)
							}
							return inputs;
						}, [])

						// Create FormData object
						console.log(problem.driverCode);
						const formData = new FormData();
						formData.append('title', problem.title);
						formData.append('difficulty', problem.difficulty);
						formData.append('description', problem.description);
						formData.append('inputs', JSON.stringify(inputs));
						formData.append('testcase', problem.testcase);
						formData.append('driverCode', JSON.stringify(problem.driverCode));

						if (files.length !== 0) {
							formData.append('files', files[0]);
							formData.append('files', files[1]);
						}

						axios.patch(`http://localhost:3000/problem/${slug}`, formData, {
							headers: {
								"Authorization": "Bearer " + localStorage.getItem("token"),
								'Content-Type': 'multipart/form-data',
							},
						})
							.then(res => {
								console.log(res)
								console.log(res.data.message);
								localStorage.removeItem("problem");
								navigate("/");
							})
							.catch(error => {
								// Handle error
								console.error('Error updating problem:', error);
							});
					}}
				>Update</Button>
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
			</div>
			<div style={{
				width: "150px",
				display: "flex",
				justifyContent: "space-between"
			}}>
				<Button
					size="small"
					variant="contained"
					color="error"
					style={{
						textTransform: "initial"
					}}
					onClick={() => {
						localStorage.removeItem("problem");
						setProblem(initialProblem);
						setFiles([]);
					}}
				>Reset</Button>
				<Button
					size="small"
					variant="contained"
					style={{
						textTransform: "initial",
						background: "#ffc107"
					}}
					onClick={() => {
						navigate(-1);
					}}
				>Cancel</Button>
			</div >
		</div>
	)
}

export default Edit;