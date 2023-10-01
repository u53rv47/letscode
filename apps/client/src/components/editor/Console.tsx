import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button, dividerClasses } from '@mui/material';
import { Add } from "@mui/icons-material";
import { useRecoilState, useRecoilValue } from 'recoil';
import { solutionInputs, solutionTestcase } from '../../store/selectors/solution';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { resultState, testcaseState } from '../../store/atoms/solution';

{/* <CaseButtons len={len} setBtn={setBtn} /> */ }
function Console(): JSX.Element {
	const [tab, setTab] = useState(0);
	const [btn, setBtn] = useState(0);
	const testcase = useRecoilValue(solutionTestcase);
	const inputs = useRecoilValue(solutionInputs);
	const [solutionTest, setSolutionTest] = useRecoilState(testcaseState);

	useEffect(() => {
		setSolutionTest(testcase);
	}, []);

	let testcases = [];
	let len = 0;
	if (solutionTest) {
		len = inputs.length;
		testcases = solutionTest.split('\n').reduce((resultArray, item, index) => {
			const chunkIndex = Math.floor(index / len);
			if (!resultArray[chunkIndex])
				resultArray[chunkIndex] = [] // start a new chunk
			resultArray[chunkIndex].push(item)
			return resultArray
		}, [])
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
						<div style={{ marginBottom: "10px" }}>
							{testcases.map((tc, index) => {
								return <Button key={"case" + index} variant='contained' size="small" style={{
									marginRight: "10px", marginBottom: "5px", background: "#eee", color: "black", textTransform: "none"
								}} onClick={() => {
									setBtn(index);
								}}> Case {index + 1}</Button>
							})}
							<Button variant='contained' size="small" style={{
								marginRight: "10px", background: "#eee", color: "black", textTransform: "none"
							}} onClick={() => {
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
							}}><Add fontSize='small' /></Button>
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
						<Typography>Run the code to see output</Typography>
					</CustomTabPanel>
				</div>
				<ButtonPanel />
			</div>}
		</>
	)
};

function ButtonPanel(): JSX.Element {
	const { slug } = useParams();
	const result = useRecoilValue(resultState);
	const testcase = useRecoilValue(testcaseState);
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
					console.log(result);
					console.log(testcase);
					// Make a backend request
					const data = { ...result, testcase };
					axios.post(`http://localhost:3000/solution/${slug}`, {
						data,
						action: "run"
					}, {
						headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
					})
						.then(res => {
							console.log(res.data);
						}).catch(e => {
							console.log(e);
						});
				}}> Run </Button>
			<Button variant='contained' style={{
				marginLeft: "10px", marginRight: "20px", background: "red", color: "black", textTransform: "none"
			}} onClick={() => {
				console.log(result);
				console.log(testcase);
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
					}).catch(e => {
						console.log(e);
					});
			}}> Submit </Button>
		</div>
	</div>
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

export default Console;