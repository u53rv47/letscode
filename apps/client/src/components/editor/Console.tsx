import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button } from '@mui/material';
import { Add } from "@mui/icons-material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { responseOutput, responseResult, solutionInputs, solutionTestcase } from '../../store/selectors/solution';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { actionState, responseState, resultState, testcaseState } from '../../store/atoms/solution';
import { Loading } from '../Loading';

{/* <CaseButtons len={len} setBtn={setBtn} /> */ }
function Console(): JSX.Element {
	const [tab, setTab] = useState(0);
	const [btn, setBtn] = useState(0);

	const inputs = useRecoilValue(solutionInputs);
	const testcase = useRecoilValue(solutionTestcase);
	const [solutionTest, setSolutionTest] = useRecoilState(testcaseState);

	useEffect(() => {
		setSolutionTest(testcase);
	}, []);

	let testcases = [];
	let len = 0;
	if (solutionTest) {
		len = inputs.length;
		let last = false;
		testcases = solutionTest.split('\n').reduce((resultArray, item, index) => {
			const chunkIndex = Math.floor(index / len);
			if (!resultArray[chunkIndex])
				resultArray[chunkIndex] = []; // start a new chunk
			resultArray[chunkIndex].push(item);

			let background = "transparent"; // Default is transparent
			if (last) {
				if (btn == chunkIndex)
					background = "#eee"; // Change to gray
				resultArray[chunkIndex].push(background);
			}
			last = !last;

			return resultArray;
		}, []);
	}

	return (
		<>
			{!!solutionTest && <div style={{
				height: "97%",
				border: "2px solid rgba(0, 0, 0, 0.08)",
				borderRadius: "5px",
				paddingLeft: "10px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-around"
			}}>
				<div>
					<Tabs value={tab}
						onChange={(e, value) => {
							setTab(value);
						}}
					>
						<Tab sx={{ textTransform: "none" }} label="Testcase" {...a11yProps(0)} />
						<Tab sx={{ textTransform: "none" }} label="Result" {...a11yProps(1)} />
					</Tabs>
				</div>
				<div style={{
					width: '100%', height: "100%", overflow: "auto"
				}}>

					<CustomTabPanel value={tab} index={0}>
						{/* Button Panel */}
						<div style={{ display: "flex", marginBottom: "10px" }}>
							{testcases.map((tc, index) => {
								return <Button key={"case" + index} size="small"
									style={{
										marginRight: "10px", marginBottom: "5px", background: tc[2], color: "black", textTransform: "none"
									}}
									onClick={() => {
										setBtn(index);
									}}> Case {index + 1}</Button>
							})}
							<div style={{ marginTop: "5px" }}
								onClick={() => {
									if (testcases.length < 10) {
										const newTestcases = testcases.concat(testcases.slice(testcases.length - 1, testcases.length));
										var newTestcase = "";
										for (var i = 0; i < newTestcases.length; i++)
											for (var j = 0; j < len; j++) {
												newTestcase += newTestcases[i][j]
												if (i != newTestcases.length - 1 || j != len - 1)
													newTestcase += "\n";
											}
										setSolutionTest(newTestcase);
										setBtn(newTestcases.length - 1);
									}
								}}> <Add fontSize='small' /></div>
						</div>
						{/* Inputs for each button */}
						{inputs.map((input, idx) => {
							return <div key={"case " + btn + "input" + idx} style={{
								marginBottom: "10px",
							}}>
								<Typography>{input.name + "="}</Typography>
								{/* Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. */}
								<TextField fullWidth size='small' variant="outlined" value={testcases[btn][idx]} onChange={(e) => {
									const val = parseInt(e.target.value)
									var newTestcase = '';
									for (var i = 0; i < testcases.length; i++) {
										for (var j = 0; j < len; j++) {
											if (i == btn && j == idx)
												newTestcase += e.target.value
											else
												newTestcase += testcases[i][j];
											if (i != testcases.length - 1 || j != len - 1)
												newTestcase += '\n'
										}
									}
									setSolutionTest(newTestcase);
								}} />
							</div>
						})}
					</CustomTabPanel>

					<CustomTabPanel value={tab} index={1} >
						<RunResult />
						<SubmitResult />
					</CustomTabPanel>
				</div >
				<ButtonPanel setTab={setTab} />
			</div >}
		</>
	)
};


function ButtonPanel(props: BtnPanelProp): JSX.Element {
	const { slug } = useParams();
	const result = useRecoilValue(resultState);
	const testcase = useRecoilValue(testcaseState);
	const setAction = useSetRecoilState(actionState);
	const setResponse = useSetRecoilState(responseState);
	return <div style={{
		display: "flex",
		justifyContent: "space-between",
		margin: "0px 10px 5px 10px"
	}}>	<Button variant='outlined'
		style={{ textTransform: "none" }}
		onClick={() => {
			const data = { ...result, testcase };
			console.log("Loging from Console")
			console.log(data)
		}}>Log me</Button>
		<div>
			<Button variant='contained' style={{
				background: "#eee", color: "black", textTransform: "none"
			}}
				onClick={() => {
					// Make a backend request
					setAction({ isLoading: true, action: true });
					props.setTab(1);
					const data = { ...result, testcase };
					axios.post(`http://localhost:3000/solution/${slug}`, {
						data,
						action: "run"
					}, {
						headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
					})
						.then(res => {
							console.log(res.data);
							setResponse(res.data);
							setAction({ isLoading: false, action: true });
						}).catch(e => {
							console.log(e);
						});
				}}> Run </Button>
			<Button variant='contained' style={{
				marginLeft: "10px", marginRight: "20px", background: "red", color: "black", textTransform: "none"
			}} onClick={() => {
				console.log(result);
				console.log(testcase);
				setAction({ isLoading: true, action: false });
				props.setTab(1);
				// Make a backend request
				const data = { ...result, testcase };
				axios.post(`http://localhost:3000/solution/${slug}`, {
					data,
					action: "submit"
				}, {
					headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
				})
					.then(res => {
						console.log(res.data);
						setResponse(res.data);
						setAction({ isLoading: false, action: false });
					}).catch(e => {
						console.log(e);
					});
			}}> Submit </Button>
		</div>
	</div>
}

function RunResult(): JSX.Element {
	const [btn, setBtn] = useState(0);

	const inputs = useRecoilValue(solutionInputs);
	const solutionTest = useRecoilValue(testcaseState);

	const action = useRecoilValue(actionState);
	const result = useRecoilValue(responseResult);
	const output = useRecoilValue(responseOutput);

	useEffect(() => {
		if (output && result === "failed" && action.action) {
			let failed = JSON.parse(output.failed_testcases);
			setBtn(failed[0] - 1);
		}
	}, []);

	if (!action.action) return <></>
	if (action.isLoading)
		return <Loading />

	let actualOutput = [], expectedOutput = [], stdOutput = [], failedTests: number[] = [], testcases: any[] = [];
	if (result !== "error") {
		actualOutput = JSON.parse(output.actual_output);
		expectedOutput = JSON.parse(output.expected_output);
		stdOutput = JSON.parse(output.console_output);
	}
	if (result === "failed")
		failedTests = JSON.parse(output.failed_testcases);
	testcases = solutionTest ? getTestcases(inputs.length, solutionTest, btn, failedTests) : [];

	switch (result) {
		case "error": return <Error error={output.error} />
		case "passed": return <div>
			<Typography variant='h5' color="#2DB55D" paddingLeft="5px">Accepted</Typography>
			<br />
			<Result btn={btn} setBtn={setBtn} inputs={inputs} testcases={testcases} stdOutput={stdOutput} actualOutput={actualOutput} expectedOutput={expectedOutput} />
		</div>
		case "failed": return <div>
			<Typography variant='h5' color="#EF4743" paddingLeft="5px">Wrong Answer</Typography>
			<br />
			<Result btn={btn} setBtn={setBtn} inputs={inputs} testcases={testcases} stdOutput={stdOutput} actualOutput={actualOutput} expectedOutput={expectedOutput} />
		</div>
	}
	return <Center><Typography>Run the program to see output.</Typography></Center>
}

function SubmitResult(): JSX.Element {
	const action = useRecoilValue(actionState);
	const result = useRecoilValue(responseResult);
	const output = useRecoilValue(responseOutput);

	const inputs = useRecoilValue(solutionInputs);
	const solutionTest = useRecoilValue(testcaseState);

	if (action.action) return <></>
	if (action.isLoading)
		return <Loading />


	let actualOutput: any[], expectedOutput: any[], stdOutput: any[], testcases: any[];
	if (result === "failed") {
		actualOutput = [JSON.parse(output.actual_output)];
		expectedOutput = [JSON.parse(output.expected_output)];
		stdOutput = JSON.parse(output.console_output);

		if (solutionTest) {
			const len = inputs.length;
			testcases = output.input.split('\n').reduce((resultArray, item, index) => {
				const chunkIndex = Math.floor(index / len);
				if (!resultArray[chunkIndex])
					resultArray[chunkIndex] = [] // start a new chunk
				resultArray[chunkIndex].push(item);
				return resultArray;
			}, []);
		}
	}

	switch (result) {
		case "error": return <Error error={output.error} />
		case "passed": return <Center>
			<Typography variant='h5' color="#2DB55D" paddingLeft="5px">Accepted</Typography>
			<Typography>All Testcases are passed!</Typography>
			<Typography>{output.output}</Typography>
		</Center>

		case "failed": return <div>
			<Typography variant='h5' color="#EF4743" paddingLeft="5px">Wrong Answer</Typography>
			<br />
			<Result btn={0} inputs={inputs} testcases={testcases} stdOutput={stdOutput} actualOutput={actualOutput} expectedOutput={expectedOutput} />
		</div>
	}
	return <Center>
		<Typography>Run the program to see output.</Typography>
	</Center>
}

function Center(props: CenterProps): JSX.Element {
	return <div style={{
		display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", position: "absolute"
	}}>
		<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			{props.children}
		</div>
	</div>
}

function Error(props: ErrorProps) {
	let error = "";
	if (typeof props.error !== "string")
		error = JSON.stringify(props.error, null, "\t");
	else error = props.error;

	return <div>
		<Typography variant='h5' color="#EF4743" paddingLeft="5px">Error</Typography>
		<div style={{
			borderRadius: "10px",
			background: "#fde8e8",
			padding: "10px",
			width: "98%",
			minHeight: "80px"
		}}>
			{error.split("\n").map((error, idx) => <Typography key={"error " + idx}
				color="error" sx={{ whiteSpace: "pre" }}>{error}</Typography>)}
		</div>
	</div>
}

function Result(props: ResultProps) {
	const action = useRecoilValue(actionState);
	return <div>
		{action.action && <div style={{ marginBottom: "10px", marginLeft: "15px" }}>
			{props.testcases.map((tc, index) => {
				return <Button key={"case" + index} size="small"
					style={{
						marginRight: "10px", marginBottom: "5px", background: tc[2], color: "black", textTransform: "none"
					}}
					onClick={() => {
						props.setBtn(index);
					}}><span style={{ marginRight: "2px", color: tc[3] }}>●</span>Case {index + 1}</Button>
			})}
		</div>}
		<Typography fontSize="17px" margin="0px 0px 2px 10px">Input</Typography>
		{props.inputs.map((input, idx) => {
			return <div key={"input" + idx} style={{
				marginBottom: "10px",
			}}>
				<div style={{
					borderRadius: "10px",
					padding: "10px",
					background: "#F7F7F8",
					marginLeft: "5px"
				}}>
					<Typography fontSize="14px" color="#5C5C5C">{input.name + "="}</Typography>
					<pre style={{
						fontSize: "16px", margin: 0, padding: 0
					}}>{props.testcases[props.btn][idx]}</pre>
				</div>
			</div>
		})}
		{props.stdOutput.some((element) => true) && <div>
			<Typography fontSize="16px" margin="10px 0px 2px 10px">Stdout</Typography>
			<div style={{
				borderRadius: "10px",
				padding: "10px",
				background: "#F7F7F8",
				marginLeft: "5px"
			}}>
				{props.stdOutput[props.btn].split("\n").map((stdout, idx) => <pre key={"stdout" + idx} style={{
					fontSize: "16px", margin: 0, padding: 0
				}}>{stdout}</pre>)}
			</div>
		</div>}
		<Typography fontSize="16px" margin="10px 0px 2px 10px">Output</Typography>
		<div style={{
			borderRadius: "10px",
			padding: "10px",
			background: "#F7F7F8",
			marginLeft: "5px"
		}}>
			<pre style={{
				fontSize: "16px", margin: 0, padding: 0
			}}>{JSON.stringify(props.actualOutput[props.btn])}</pre>
		</div>
		<Typography fontSize="16px" margin="10px 0px 2px 10px">Expected</Typography>
		<div style={{
			borderRadius: "10px",
			padding: "10px",
			background: "#F7F7F8",
			marginLeft: "5px"
		}}>
			<pre style={{
				fontSize: "16px", margin: 0, padding: 0
			}}>{JSON.stringify(props.expectedOutput[props.btn])}</pre>
		</div>
	</div>
}

function getTestcases(len: number, solutionTest: string, btn: number, failedTests: number[]): any[] {
	let last = false;
	const testcases = solutionTest.split('\n').reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / len);
		if (!resultArray[chunkIndex])
			resultArray[chunkIndex] = [] // start a new chunk
		resultArray[chunkIndex].push(item);

		let background = "transparent"; // Default is transparent
		let color = "#2DB55D"; // Default is green
		if (last) {
			if (btn == chunkIndex)
				background = "#eee"; // Change to gray
			resultArray[chunkIndex].push(background);

			if (failedTests) {
				for (let i = 0; i < failedTests.length; i++) {
					if (failedTests[i] === chunkIndex + 1)
						color = "#EF4743"; // Change to red
				}
				resultArray[chunkIndex].push(color);
			}
		}
		last = !last;

		return resultArray;
	}, []);
	return testcases;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}
			{...other}
			style={{
				width: "98%",
				height: "97%",
				position: "relative"
			}}
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
interface CenterProps {
	children?: React.ReactNode;
}

interface BtnPanelProp {
	setTab: React.Dispatch<React.SetStateAction<number>>;
}

interface ErrorProps {
	error: string;
}

interface ResultProps {
	btn?: number;
	setBtn?: React.Dispatch<React.SetStateAction<number>>;

	inputs: any[];
	testcases: any[];
	stdOutput: string[];
	actualOutput: any[];
	expectedOutput: any[];
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

export default Console;