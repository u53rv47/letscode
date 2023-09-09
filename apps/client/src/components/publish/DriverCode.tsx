import { useState } from "react";
import { useRecoilState } from "recoil";
import { problemDriverCode } from "../../store/selectors/problem";
import { Box, Tab, Tabs, TextField, Typography } from "@mui/material";

export default function DriverCode(): JSX.Element {
	const [tab, setTab] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};
	return (
		<div style={{
			marginTop: "0px",
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
					<Typography>Code Stub</Typography>
					<Result language="java"></Result>

					<Typography marginTop="10px">Driver</Typography>
					<Driver language="java"></Driver>

					<Typography marginTop="10px">Solution</Typography>
					<Solution language="java"></Solution>
				</CustomTabPanel>


				<CustomTabPanel value={tab} index={1} >
					<Typography>Code Stub</Typography>
					<Result language="python"></Result>

					<Typography marginTop="10px">Driver</Typography>
					<Driver language="python"></Driver>

					<Typography marginTop="10px">Solution</Typography>
					<Solution language="python"></Solution>
				</CustomTabPanel>


				<CustomTabPanel value={tab} index={2}>
					<Typography>Code Stub</Typography>
					<Result language="javascript"></Result>

					<Typography marginTop="10px">Driver</Typography>
					<Driver language="javascript"></Driver>

					<Typography marginTop="10px">Solution</Typography>
					<Solution language="javascript"></Solution>
				</CustomTabPanel>
			</div>
		</div>

	)
}

interface DriverProps {
	language: string;
}

function Result(props: DriverProps): JSX.Element {
	const [driverCode, setDriverCode] = useRecoilState(problemDriverCode);

	return (
		<TextField multiline fullWidth size="small" minRows={5} value={driverCode[props.language].result}
			onChange={(e) => {
				const newDriverCode = JSON.parse(JSON.stringify(driverCode));
				newDriverCode[props.language] = {
					result: e.target.value,
					driver: driverCode[props.language].driver,
					codeChecker: driverCode[props.language].codeChecker,
				}
				setDriverCode(newDriverCode);
			}}></TextField>
	);
}

function Driver(props: DriverProps): JSX.Element {
	const [driverCode, setDriverCode] = useRecoilState(problemDriverCode);

	return (
		<TextField multiline fullWidth size="small" minRows={7} value={driverCode[props.language].driver}
			onChange={(e) => {
				const newDriverCode = JSON.parse(JSON.stringify(driverCode));
				newDriverCode[props.language] = {
					result: driverCode[props.language].result,
					driver: e.target.value,
					solution: driverCode[props.language].solution,
				}
				console.log(newDriverCode)
				setDriverCode(newDriverCode);
			}}></TextField>
	);
}


function Solution(props: DriverProps): JSX.Element {
	const [driverCode, setDriverCode] = useRecoilState(problemDriverCode);

	return (
		<TextField multiline fullWidth size="small" minRows={7} value={driverCode[props.language].solution}
			onChange={(e) => {
				const newDriverCode = JSON.parse(JSON.stringify(driverCode));
				newDriverCode[props.language] = {
					result: driverCode[props.language].result,
					driver: driverCode[props.language].driver,
					solution: e.target.value,
				}
				setDriverCode(newDriverCode);
			}}></TextField>
	);
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