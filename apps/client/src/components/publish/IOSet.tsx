import { TextField, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Button, Link } from '@mui/material'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from 'react';
import { RecoilState, useRecoilState, useRecoilValue } from 'recoil'
import { initialIO } from '../../store/atoms/problem';
import { tempInputName } from '../../store/selectors/temp';

interface IOprops {
	type: string;
	state: RecoilState<{
		name: string;
		type: string;
		add: boolean;
	}[]>
}
export default function IOSet(props: IOprops) {
	const ios = useRecoilValue(props.state);
	console.log(ios)

	return (
		<div>
			<Typography >{props.type}</Typography>
			{ios.map((io, index) => (
				<IO name={io.name} type={io.type} add={io.add}
					index={index} state={props.state} key={Math.random()} />
			))}
		</div >
	);
}

interface IOs {
	name: string;
	type: string;
	add: boolean;

	index: number;
	state: RecoilState<{
		name: string;
		type: string;
		add: boolean;
	}[]>
}

function IO(props: IOs) {

	const [name, setName] = useState(props.name);
	const [type, setType] = useState(props.type);
	const [ios, setIOs] = useRecoilState(props.state);

	return (
		<div style={{
			display: "flex",
			justifyContent: "center",
			marginTop: "10px"
		}}>
			<div style={{
				width: "400px",
			}}>
				<TextField variant="outlined" size="small" label="Name" value={name}
					onChange={(e) => {
						setName(e.target.value);
					}} />
			</div>
			<FormControl fullWidth size='small'>
				<InputLabel>Type</InputLabel>
				<Select
					value={type}
					label="Type"
					onChange={(e) => {
						setType(e.target.value)
					}}
				>
					<MenuItem value="Variable">Variable</MenuItem>
					<MenuItem value="1DArray">1D Array</MenuItem>
					<MenuItem value="2DArray">2D Array</MenuItem>
				</Select>
			</FormControl>

			{props.add && < Button
				onClick={() => {
					let temp = [];
					for (let i = 0; i < ios.length - 1; i++) {
						const tempName = ios[i].name;
						const tempType = ios[i].type;
						temp.push({ name: tempName, type: tempType, add: false });
					}

					temp.push({ name, type, add: false });
					temp.push(initialIO);

					setIOs(temp);
				}} >
				<ControlPointIcon color='action' />
			</Button>}
			{!props.add && < Button
				onClick={() => {
					let temp = [];
					for (let i = 0; i < ios.length - 1; i++) {
						if (i === props.index) {
							continue;
						}
						const tempName = ios[i].name;
						const tempType = ios[i].type;
						temp.push({ name: tempName, type: tempType, add: false });
					}

					temp.push(initialIO);
					setIOs(temp);
				}} >
				<RemoveCircleOutlineIcon color='action' />
			</Button>}
		</div>
	);
}