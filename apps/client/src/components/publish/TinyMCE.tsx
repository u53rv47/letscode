import { useRef } from 'react';
import { useRecoilState } from 'recoil';
import BundledEditor from '../../BundledEditor'
import { problemDescription } from '../../store/selectors/problem';

export default function TinyMCE() {
	const [description, setDescription] = useRecoilState(problemDescription);
	const editorRef = useRef(null);

	const log = () => {
		if (editorRef.current) {
			console.log(editorRef.current.getContent());
		}
	};
	return (
		<div
			style={{
				width: "100%",
				margin: "10px 0px 10px"
			}}>
			<BundledEditor
				onInit={(evt, editor) => editorRef.current = editor}
				value={description}
				onEditorChange={(newValue, editor) => setDescription(newValue)}
				init={{
					selector: "textarea",
					menubar: false,
					plugins: [
						'codesample', 'autoresize', 'lists', 'searchreplace'
					],
					toolbar: 'blocks | bold italic codesample | alignleft aligncenter alignright alignjustify | bullist numlist',
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
					block_formats: 'Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4;'
				}}
			/>
			{/* <button onClick={log}>Log editor content</button> */}
		</div>
	);
}

