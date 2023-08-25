import { useRecoilValue } from "recoil";
import parse, { Element, HTMLReactParserOptions, domToReact } from 'html-react-parser';
import { Typography } from "@mui/material";
import { problemDescription, problemDetails, problemTitle } from "../../store/selectors/problem";


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
	const title = useRecoilValue(problemTitle);
	const description = useRecoilValue(problemDescription);

	const parsed = parse(description, options);
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
			}}>{title}</Typography>
			<br />
			{parsed}
		</div>
	)
}

export default Description;