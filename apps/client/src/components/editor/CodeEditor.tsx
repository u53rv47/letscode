import { Grid, Box, Typography, Select, MenuItem, SelectChangeEvent, Switch, FormControlLabel } from "@mui/material";
import Editor from '@monaco-editor/react'
import { useState } from 'react'


const languages = {
	"java": {
		language: 'java',
		value:
			`class Solution{
	public static void main(String[] args){
		System.out.println("Hello World");
	}
}`
	},
	"python": {
		language: 'python',
		value: 'print("Hello World")',
	},
	"javascript": {
		language: 'javascript',
		value: 'console.log("Hello World")'
	}
};

function CodeEditor(): JSX.Element {
	const [language, setLanguage] = useState('javascript');
	const [theme, setTheme] = useState("Dark");

	const editorLanguage = languages[language];
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
					value={language}
					onChange={(event: SelectChangeEvent) => {
						setLanguage(event.target.value as string);
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
				defaultLanguage={'javascript'}
				defaultValue={languages['javascript'].value}
				language={editorLanguage.language}
				value={editorLanguage.value}

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