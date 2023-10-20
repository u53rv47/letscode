import { Button, Select, MenuItem, SelectChangeEvent, Switch, FormControlLabel } from "@mui/material";
import Editor from '@monaco-editor/react'
import { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from "recoil";
import { resultState } from "../../store/atoms/solution";
import { solutionResult } from "../../store/selectors/solution";
import { driverCode } from "../../store/atoms/problem";


function CodeEditor(): JSX.Element {
	const [theme, setTheme] = useState('Dark');
	const sResult = useRecoilValue(solutionResult);
	const [result, setResult] = useRecoilState(resultState);

	const editorTheme = theme === 'Dark' ? 'vs-dark' : 'light';

	useEffect(() => {
		setResult({ language: 'java', result: sResult.java });
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
					value={result.language}
					onChange={(event: SelectChangeEvent) => {
						const language = event.target.value as string
						setResult({ language, result: sResult[language] });
					}}
				>
					<MenuItem value='java'>Java</MenuItem>
					<MenuItem value='python'>Python</MenuItem>
					<MenuItem value='javascript'>JavaScript</MenuItem>
				</Select>
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
				defaultLanguage="java"
				defaultValue={driverCode.java.result}
				language={result.language}
				value={result.result}
				onChange={(newValue, e) => {
					setResult({ language: result.language, result: newValue })
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