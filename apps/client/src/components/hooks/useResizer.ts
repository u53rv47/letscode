import React, { useEffect } from 'react';


export default function useResizer(
	refDescription: React.MutableRefObject<any>,
	refRightPanel: React.MutableRefObject<any>,
	refCodeEditor: React.MutableRefObject<any>,
	refConsole: React.MutableRefObject<any>,

	refVertical: React.MutableRefObject<any>,
	refHorizontal: React.MutableRefObject<any>) {
	useEffect(() => {
		const lResizableElement = refDescription.current;
		const rResizableElement = refRightPanel.current;

		const lStyles = window.getComputedStyle(lResizableElement);
		const rStyles = window.getComputedStyle(rResizableElement);

		let lWidth = parseInt(lStyles.width, 10);
		let rWidth = parseInt(rStyles.width, 10);

		let xCord = 0;

		const onMouseMoveVerticalResize = (event: MouseEvent) => {
			const dx = event.clientX - xCord;
			lWidth = lWidth + dx;
			rWidth = rWidth - dx;
			xCord = event.clientX;
			lResizableElement.style.width = `${lWidth}px`;
			rResizableElement.style.width = `${rWidth}px`;
		}

		const onMouseUpVerticalResize = (event: MouseEvent) => {
			document.removeEventListener("mousemove", onMouseMoveVerticalResize);
		}

		const onMouseDownVerticalResize = (event: MouseEvent) => {
			xCord = event.clientX;

			lResizableElement.style.left = lStyles.left;
			lResizableElement.style.right = null;

			rResizableElement.style.right = rStyles.right;
			rResizableElement.style.left = null;

			document.addEventListener("mousemove", onMouseMoveVerticalResize);
			document.addEventListener("mouseup", onMouseUpVerticalResize);
		}

		const verticalResizer = refVertical.current;
		verticalResizer.addEventListener("mousedown", onMouseDownVerticalResize);



		const uResizableElement = refCodeEditor.current;
		const dResizableElement = refConsole.current;

		const uStyles = window.getComputedStyle(lResizableElement);
		const dStyles = window.getComputedStyle(rResizableElement);

		let uHeight = parseInt(uStyles.height, 10);
		let dHeight = parseInt(dStyles.height, 10);

		let yCord = 0;

		const onMouseMoveHorizontalResize = (event: MouseEvent) => {
			const dy = event.clientY - yCord;
			dHeight = dHeight - 2 * dy;
			uHeight = uHeight + 2 * dy;
			// dHeight = dHeight - dy;
			// uHeight = uHeight + dy;
			yCord = event.clientY;
			uResizableElement.style.height = `${uHeight}px`;
			dResizableElement.style.height = `${dHeight}px`;
		}

		const onMouseUpHorizontalResize = (event: MouseEvent) => {
			document.removeEventListener("mousemove", onMouseMoveHorizontalResize);
		}

		const onMouseDownHorizontalResize = (event: MouseEvent) => {
			yCord = event.clientY;

			uResizableElement.style.top = uStyles.top;
			uResizableElement.style.bottom = null;

			dResizableElement.style.bottom = dStyles.right;
			dResizableElement.style.top = null;

			document.addEventListener("mousemove", onMouseMoveHorizontalResize);
			document.addEventListener("mouseup", onMouseUpHorizontalResize);
		}


		const horizontalResizer = refHorizontal.current;
		horizontalResizer.addEventListener("mousedown", onMouseDownHorizontalResize);

		return () => {
			verticalResizer.removeEventListener("mousedown", onMouseDownVerticalResize);
			horizontalResizer.removeEventListener("mousedown", onMouseDownHorizontalResize);
		}

	}, []);
}