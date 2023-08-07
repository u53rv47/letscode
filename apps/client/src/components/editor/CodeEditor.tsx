import { Button, Select, MenuItem, SelectChangeEvent, Switch, FormControlLabel } from "@mui/material";
import Editor from '@monaco-editor/react'
import { useState, useRef } from 'react'
import { useRecoilState } from "recoil";
import { solutionDetails } from "../../store/selectors/solution";
import { languages } from "../../store/atoms/solution";


function CodeEditor(): JSX.Element {
	const [solution, setSolution] = useRecoilState(solutionDetails)
	const [theme, setTheme] = useState("Dark");
	const editorRef = useRef(null);

	const editorTheme = theme === "Dark" ? 'vs-dark' : 'light';


	return (
		<div style={{
			height: "99%",
			// background: "#313131",
			overflow: "hidden",
			border: "2px solid rgba(0, 0, 0, 0.08)",
			borderRadius: "10px",
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
						setSolution({ language, value: languages[language].value });
					}}
				>
					<MenuItem value='java'>Java</MenuItem>
					<MenuItem value='python'>Python</MenuItem>
					<MenuItem value='javascript'>JavaScript</MenuItem>
				</Select>
				<Button onClick={() => {
					const editorValue = editorRef.current.getValue();
					setSolution({ language: solution.language, value: editorValue })
					console.log(editorValue)

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
				onMount={(editor, monaco) => {
					editorRef.current = editor;
				}}
				theme={editorTheme}
				defaultLanguage={solution.language}
				defaultValue={solution.value}
				language={solution.language}
				value={solution.value}

				options={{
					minimap: { enabled: false },
					scrollbar: {
						horizontal: "hidden",
						vertical: "hidden",
					},
					wordWrap: 'on',
					formatOnType: true
				}}
			/>
		</div>
	)
}

export default CodeEditor;