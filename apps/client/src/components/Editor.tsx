import { MoreVert, MoreHoriz } from "@mui/icons-material";
import Description from "./editor/Description";
import CodeEditor from "./editor/CodeEditor";
import Console from "./editor/Console";
import { useRef } from 'react';
import useResizer from "./hooks/useResizer";

function Editor(): JSX.Element {

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
			{/* Second child of MainArea ==> CodeEditor + (HorizontalResizer + Console)*/}
			<div ref={refRightPanel}
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					width: "60%",
					minWidth: "384px",
				}}>
				{/* CodeEditor */}
				<div ref={refCodeEditor}
					style={{
						height: "70%",
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
					<Console />
				</div>
			</div>
		</div>
	)
}

export default Editor;