import { problemDescription, problemDetails } from "../../store/selectors/problem";
import { useRecoilState, useRecoilValue } from "recoil";
import parse, { Element, HTMLReactParserOptions, domToReact } from 'html-react-parser';
import { useEffect } from "react";
import axios from "axios";
import { Typography } from "@mui/material";

const options: HTMLReactParserOptions = {
	replace: ({ name, attribs, children }: Element) => {
		// if (!attribs) {
		// 	return;
		// }

		if (name === 'p') {
			return <Typography >{domToReact(children, options)}</Typography>;
		}

		if (name === 'h2' || name === 'h3' || name === 'h4') {
			return (
				<Typography variant={name} style={{ color: 'hotpink' }}>
					{domToReact(children, options)}
				</Typography>
			);
		}
		if (name === 'pre') {
			return <pre style={{
				background: "white",
				borderRadius: "5px",
				fontSize: "16px",
				padding: "10px",
				marginRight: "5px"
			}}>{domToReact(children, options)}</pre>
		}
		if (name === 'code') {
			return <code style={{
				fontSize: "16px"
			}}>{domToReact(children, options)}</code>
		}
	}
};

function Description() {
	const [problem, setProblem] = useRecoilState(problemDetails);

	// const init = async () => {
	// 	const res = await axios.get("http://localhost:3000/problem", {
	// 		headers: {
	// 			"Authorization": "Bearer " + localStorage.getItem("token")
	// 		}
	// 	});
	// 	if (res.data) {
	// 		setProblem({ title: res.data[2].title, description: res.data[2].description, inputs: res.data[2].inputs, testcase: res.data[2].testcase, driverCode: res.data[2].driverCode })
	// 	}
	// }

	useEffect(() => {
		// init();
		const localProblem = localStorage.getItem("problem");
		if (localProblem) {
			setProblem(JSON.parse(localProblem));
		}
	}, []);


	const parsed = parse(problem.description, options);
	return (
		<div style={{
			borderRadius: "5px",
			paddingLeft: "10px",
			maxHeight: "95.5vh",
			width: "100%",
			overflow: "auto",
			// background: "#fffcf1"
			background: "#eee"
		}}>
			<Typography variant="h4" style={{
				marginTop: "10px"
			}}>{problem.title}</Typography>
			<br />
			{parsed}
		</div>
	)
}

export default Description;