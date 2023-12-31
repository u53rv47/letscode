import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { MoreVert, MoreHoriz } from "@mui/icons-material";
import useResizer from "./hooks/useResizer";
import Description from "./editor/Description";
import CodeEditor from "./editor/CodeEditor";
import Console from "./editor/Console";
import { isSolutionLoading } from '../store/selectors/solution';
import { solutionState, initialSolution } from '../store/atoms/solution';
import { Loading } from './Loading';

function Editor(): JSX.Element {
	const { slug } = useParams();
	const navigate = useNavigate();

	const solutionLoading = useRecoilValue(isSolutionLoading);
	const [solution, setSolution] = useRecoilState(solutionState);

	useEffect(() => {
		console.log(solution);
		const token = localStorage.getItem("token");
		if (token) {
			axios.get(`http://localhost:3000/solution/${slug}`, {
				headers: {
					"Authorization": "Bearer " + token
				}
			}).then(res => {
				const solution = { title: res.data.title, description: res.data.description, inputs: res.data.inputs, testcase: res.data.testcase, result: res.data.result }
				setSolution({ isLoading: false, solution });
				console.log("Editor request:");
				console.log(res.data);
			})
				.catch(e => {
					console.log(e);
					setSolution({ isLoading: false, solution: initialSolution });
				});
		} else navigate("/signin");

	}, []);

	if (solutionLoading)
		return <Loading />
	return <UI />
}

function UI(): JSX.Element {
	const refDescription = useRef(null);
	const refRightPanel = useRef(null);
	const refCodeEditor = useRef(null);
	const refConsole = useRef(null);

	const refVertical = useRef(null);
	const refHorizontal = useRef(null);

	useResizer(
		refDescription,
		refRightPanel,
		refCodeEditor,
		refConsole,
		refVertical,
		refHorizontal
	);
	return (
		//Main Area
		<div style={{
			display: "flex",
			justifyContent: "space-between",
			width: "100%",
			height: "100%",
			background: "white",
		}}>
			{/* First child of MainArea => Description box = Description + verticalResizer */}
			<div ref={refDescription}
				style={{
					display: "flex",
					justifyContent: "space-between",
					width: "40%",
					height: "100%",
					minWidth: "380px",
				}}>
				<Description />
				<div ref={refVertical} style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					cursor: "col-resize",
					background: "white"
				}}>
					<MoreVert fontSize="large" style={{
						marginLeft: -12,
						marginRight: -12,
						color: "#767676"
					}} />
				</div>
			</div>
			<div ref={refRightPanel}
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					width: "60%",
					height: "100%",
					minWidth: "500px",
				}}
			>
				{/* CodeEditor */}
				<div ref={refCodeEditor}
					style={{
						height: "60%",
						minHeight: "200px",
					}}>
					<CodeEditor />
				</div>
				{/* Console =  HorizontalResizer + Console*/}
				<div ref={refConsole}
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						minHeight: "200px",
						height: "40%",
					}}>

					<div ref={refHorizontal} style={{
						display: "flex",
						justifyContent: "center",
						cursor: "row-resize",
						background: "white",
					}}>
						<MoreHoriz fontSize="large" style={{
							marginTop: "-12px",
							marginBottom: "-12px",
							color: "#767676"
						}} />
					</div>
					<Console />
				</div>
			</div>
		</div>
	)
}
export default Editor;