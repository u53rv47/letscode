import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button } from '@mui/material';
import { Add } from "@mui/icons-material";
import { useRecoilState, useRecoilValue } from 'recoil';
import { solutionValue } from '../../store/selectors/solution';
import { problemInputs, problemTestcase } from '../../store/selectors/problem';


function Console(): JSX.Element {
	const [tab, setTab] = useState(0);
	const [btn, setBtn] = useState(0);
	const inputs = useRecoilValue(problemInputs);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};
	if (inputs.length === 1)
		return <></>
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
					onChange={handleChange}
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
					<div style={{ marginBottom: "10px" }}>
						{inputs.map((input, index) => (
							<Button variant='contained' size="small" key={Math.random()} style={{
								marginRight: "10px", background: "#eee", color: "black", textTransform: "none"
							}} onClick={() => {
								setBtn(index);
							}}> {`Case ${index + 1}`}</Button>
						))}
						<Button variant='contained' size="small" style={{
							marginRight: "10px", background: "#eee", color: "black", textTransform: "none"
						}} ><Add fontSize='small' /> </Button>
					</div>
					{inputs.map((input, i) => {
						console.log("Index: " + i);
						console.log(input)
						return (
							<Inputs name={input.name} btn={btn} index={i} key={Math.random()}></Inputs>
						)
					})}

				</CustomTabPanel>

				<CustomTabPanel value={tab} index={1} >
					<Typography>Run the code to see output</Typography>
				</CustomTabPanel>
			</div>
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

interface InputProps {
	key: number;
	name: string;
	index: number;
	btn: number;
}
function Inputs(props: InputProps): JSX.Element {
	const inputs = useRecoilValue(problemInputs);
	const [testcase, setTestcase] = useRecoilState(problemTestcase);
	var len = inputs.length - 1;
	const testcases = testcase.split('\n').reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / len);
		if (!resultArray[chunkIndex])
			resultArray[chunkIndex] = [] // start a new chunk
		resultArray[chunkIndex].push(item)
		return resultArray
	}, [])

	console.log(testcases)

	return (
		<div style={{
			marginBottom: "10px",
		}}>
			<Typography>{props.name + "="}</Typography>
			<TextField fullWidth={true} size='small' variant="outlined" value={testcases[props.btn][props.index]} />
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

export default Console;