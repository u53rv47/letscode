import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button, dividerClasses } from '@mui/material';
import { Add } from "@mui/icons-material";
import { useRecoilState, useRecoilValue } from 'recoil';
import { problemInputs, problemTestcase } from '../../store/selectors/problem';
import { tempTestcaseState } from '../../store/atoms/solution';

{/* <CaseButtons len={len} setBtn={setBtn} /> */ }
function Console(): JSX.Element {
	const [tab, setTab] = useState(0);
	const [btn, setBtn] = useState(0);
	const testcase = useRecoilValue(problemTestcase);
	const inputs = useRecoilValue(problemInputs);
	const [solutionTest, setSolutionTest] = useRecoilState(tempTestcaseState);

	const len = inputs.length;
	const testcases = solutionTest.split('\n').reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / len);
		if (!resultArray[chunkIndex])
			resultArray[chunkIndex] = [] // start a new chunk
		resultArray[chunkIndex].push(item)
		return resultArray
	}, [])
	useEffect(() => {
		setSolutionTest(testcase);
	}, []);

	return (
		<div style={{
			height: "100%",
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
					aria-label="basic tabs example"
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
			{/* <ButtonPanel/> */}
			<div style={{
				display: "flex",
				justifyContent: "right",
				margin: "10px"
			}}>
				<Button variant='contained' style={{
					background: "#eee", color: "black", textTransform: "none"
				}}
					onClick={() => {
						// console.log(solution);
						// Make a backend request
					}}> Run </Button>
				<Button variant='contained' style={{
					marginLeft: "10px", marginRight: "20px", background: "red", color: "black", textTransform: "none"
				}} > Submit </Button>
			</div>
		</div>
	)
};


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