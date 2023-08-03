import { problemDescription, problemDetails } from "../../store/selectors/problem";
import { useRecoilState, useRecoilValue } from "recoil";
import { Editor } from "slate";
import { rules } from "./index";
// import Html from 'slate-html-serializer'

// const html = new Html({ rules })
import { slateToHtml } from 'slate-serializers'
import parse from 'html-react-parser';
import { useEffect } from "react";
import axios from "axios";
import { initialValue } from "../../store/atoms/problem";



function Description() {
	const [problem, setProblem] = useRecoilState(problemDetails);

	const init = async () => {
		const res = await axios.get("http://localhost:3000/problem", {
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("token")
			}
		});
		if (res.data) {
			setProblem({ title: res.data[2].title, description: JSON.parse(res.data[2].description) })
		}
	}

	useEffect(() => {
		init();
	}, []);

	const serializedToHtml = slateToHtml(problem.description);
	const parsed = parse(serializedToHtml);

	console.log(serializedToHtml);
	console.log(parsed);

	return (
		<div>
			{parsed}
		</div>
	)
}

const renderNode = props => {
	switch (props.node.type) {
		case 'code':
			return (
				<pre {...props.attributes}>
					<code>{props.children}</code>
				</pre>
			)
		case 'paragraph':
			return <p {...props.attributes}>{props.children}</p>
		case 'quote':
			return <blockquote {...props.attributes}>{props.children}</blockquote>
	}
}

const renderMark = props => {
	switch (props.mark.type) {
		case 'bold':
			return <strong>{props.children}</strong>
		case 'italic':
			return <em>{props.children}</em>
		case 'underline':
			return <u>{props.children}</u>
	}
}


export default Description;