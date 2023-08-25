import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MoreVert, MoreHoriz } from "@mui/icons-material";
import useResizer from "./hooks/useResizer";
import Description from "./editor/Description";
import CodeEditor from "./editor/CodeEditor";
import Console from "./editor/Console";
import { initialProblem, problemState } from "../store/atoms/problem";
import { isProblemLoading } from '../store/selectors/problem';

function Editor(): JSX.Element {
	const setProblem = useSetRecoilState(problemState);
	const problemLoading = useRecoilValue(isProblemLoading);
	const { slug } = useParams();

	useEffect(() => {
		axios.get(`http://localhost:3000/problem/${slug}`, {
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("token")
			}
		}).then(res => {
			const problem = { title: res.data.title, description: res.data.description, inputs: res.data.inputs, testcase: res.data.testcase, driverCode: res.data.driverCode }
			setProblem({ isLoading: false, problem });
			console.log("Response(Editor)")
			console.log(res.data)
		})
			.catch(e => {
				setProblem({ isLoading: false, problem: initialProblem });
			});
	}, []);

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
			width: "100vw",
			height: "95.5vh",
			background: "white",
			// marginTop: "10px"
		}}>
			{/* First child of MainArea => Description box = Description + verticalResizer */}
			<div ref={refDescription}
				style={{
					display: "flex",
					justifyContent: "space-between",
					width: "40%",
					minWidth: "384px",
				}}>
				{!problemLoading && <Description />}
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
			{/* Second child of MainArea ==> CodeEditor + (HorizontalResizer + Console)*/}
			<div ref={refRightPanel}
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					width: "60%",
					minWidth: "500px",
				}}>
				{/* CodeEditor */}
				<div ref={refCodeEditor}
					style={{
						height: "70%",
						minHeight: "200px",
					}}>
					{!problemLoading && <CodeEditor />}
				</div>
				{/* Console =  HorizontalResizer + Console*/}
				<div ref={refConsole}
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						height: "30%",
						minHeight: "100px",
					}}>

					<div ref={refHorizontal} style={{
						display: "flex",
						justifyContent: "center",
						cursor: "row-resize",
						background: "white"

					}}>
						<MoreHoriz fontSize="large" style={{
							marginTop: -12,
							marginBottom: -12,
							color: "#767676"
						}} />
					</div>
					{!problemLoading && <Console />}
				</div>
			</div>
		</div>
	)
}

export default Editor;