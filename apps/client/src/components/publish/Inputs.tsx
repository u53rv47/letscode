import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil'
import { initialInputs } from '../../store/atoms/problem';
import { problemInputs } from '../../store/selectors/problem';


export default function Inputs() {
	const inputs = useRecoilValue(problemInputs);

	return (
		<div>
			{inputs.map((input, index) => (
				<Input name={input.name} type={input.type} add={input.add}
					index={index} key={Math.random()} />
			))}
		</div >
	);
}


interface Inputs {
	name: string;
	type: string;
	add: boolean;

	index: number;
}

function Input(props: Inputs) {

	const [name, setName] = useState(props.name);
	const [type, setType] = useState(props.type);
	const [inputs, setInputs] = useRecoilState(problemInputs);

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
					for (let i = 0; i < inputs.length - 1; i++) {
						const tempName = inputs[i].name;
						const tempType = inputs[i].type;
						temp.push({ name: tempName, type: tempType, add: false });
					}

					temp.push({ name, type, add: false });
					temp.push(initialInputs);

					setInputs(temp);
				}} >
				<ControlPointIcon color='action' />
			</Button>}
			{!props.add && < Button
				onClick={() => {
					let temp = [];
					for (let i = 0; i < inputs.length - 1; i++) {
						if (i === props.index) {
							continue;
						}
						const tempName = inputs[i].name;
						const tempType = inputs[i].type;
						temp.push({ name: tempName, type: tempType, add: false });
					}

					temp.push(initialInputs);
					setInputs(temp);
				}} >
				<RemoveCircleOutlineIcon color='action' />
			</Button>}
		</div>
	);
}