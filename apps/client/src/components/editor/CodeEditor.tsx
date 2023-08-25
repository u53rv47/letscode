import { Button, Select, MenuItem, SelectChangeEvent, Switch, FormControlLabel } from "@mui/material";
import Editor from '@monaco-editor/react'
import { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from "recoil";
import { tempSolutionState } from "../../store/atoms/solution";
import { problemDriverCode } from "../../store/selectors/problem";


function CodeEditor(): JSX.Element {
	const [theme, setTheme] = useState('Dark');
	const driverCode = useRecoilValue(problemDriverCode);
	const [solution, setSolution] = useRecoilState(tempSolutionState);

	const editorTheme = theme === 'Dark' ? 'vs-dark' : 'light';
	useEffect(() => {
		setSolution({ language: 'java', value: driverCode['java'].value });
	}, [])
	return (
		<div style={{
			height: "99%",
			// background: "#313131",
			overflow: "hidden",
			border: "2px solid rgba(0, 0, 0, 0.08)",
			borderRadius: "5px",
		}}>
			<div style={{
				display: "flex",
				justifyContent: "space-between",
				marginLeft: "10px",
				marginRight: "10px",
			}}>
				<Select
					variant="standard"
					value={solution.language}
					onChange={(event: SelectChangeEvent) => {
						const language = event.target.value as string
						setSolution({ language, value: driverCode[language].value });
					}}
				>
					<MenuItem value='java'>Java</MenuItem>
					<MenuItem value='python'>Python</MenuItem>
					<MenuItem value='javascript'>JavaScript</MenuItem>
				</Select>
				<Button onClick={() => {
					console.log(solution.value)
				}}>Log me</Button>
				<FormControlLabel
					control={
						< Switch onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
							if (checked)
								setTheme("Light")
							else setTheme("Dark")
						}} />
					}
					label={theme}
					labelPlacement="start"
				/>
			</div>

			<Editor
				theme={editorTheme}
				defaultLanguage={solution.language}
				defaultValue={solution.value}
				language={solution.language}
				value={solution.value}
				onChange={(newValue, e) => {
					setSolution({ language: solution.language, value: newValue })
				}}
				options={{
					minimap: { enabled: false },
					scrollbar: {
						horizontal: "hidden",
						vertical: "hidden",
					},
					wordWrap: 'on',
					formatOnType: true,
				}}
			/>
		</div>
	)
}

export default CodeEditor;