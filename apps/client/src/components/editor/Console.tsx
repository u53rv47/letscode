import * as React from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button } from '@mui/material';
import { Add } from "@mui/icons-material";
import { constSelector, useRecoilValue } from 'recoil';
import { solutionValue } from '../../store/selectors/solution';


function Console(): JSX.Element {
	const [tab, setTab] = React.useState(0);
	const solution = useRecoilValue(solutionValue);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};

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
						<Button variant='contained' size="small" style={{
							marginRight: "10px", background: "#eee", color: "black", textTransform: "none"
						}} > Case 1 </Button>
						<Button variant='contained' size="small" style={{
							marginRight: "10px", background: "#eee", color: "black", textTransform: "none"
						}} > Case 1 </Button>
						<Button variant='contained' size="small" style={{
							marginRight: "10px", background: "#eee", color: "black", textTransform: "none"
						}} > Case 2 </Button>
						<Button variant='contained' size="small" style={{
							marginRight: "10px", background: "#eee", color: "black", textTransform: "none"
						}} ><Add fontSize='small' /> </Button>

					</div>

					<Typography>nums=</Typography>
					<TextField fullWidth={true} size='small' variant="outlined" />
					<Typography>target=</Typography>
					<TextField fullWidth={true} size='small' variant="outlined" />

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
						console.log(solution);
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