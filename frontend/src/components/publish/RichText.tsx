import { useCallback, useMemo } from 'react'
import { useRecoilState } from 'recoil'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
	Editor,
	Transforms,
	createEditor,
	Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'

import { Button, Icon, Toolbar } from './SlateComponents'
import { Typography } from '@mui/material'
import { problemDescription } from '../../store/selectors/problem'

const HOTKEYS = {
	'mod+b': 'bold',
	'mod+i': 'italic',
	'mod+u': 'underline',
	'mod+`': 'code'
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const RichText = () => {
	const [description, setDescription] = useRecoilState(problemDescription);

	const renderElement = useCallback(props => <Element {...props} />, [])
	const renderLeaf = useCallback(props => <Leaf {...props} />, [])
	// const editor = useMemo(() =>
	// 	withHtml(withReact(withHistory(createEditor()))),
	// 	[]);
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	return (
		<Slate
			editor={editor}
			initialValue={description}
			onChange={value => {
				const isAstChange = editor.operations.some(
					op => 'set_selection' !== op.type
				)
				if (isAstChange) {
					setDescription(value);
				}
			}}>
			<Toolbar>
				<MarkButton format="bold" icon="format_bold" />
				<MarkButton format="italic" icon="format_italic" />
				<MarkButton format="underline" icon="format_underlined" />
				<MarkButton format="code" icon="code" />
				<BlockButton format="heading-one" icon="looks_one" />
				<BlockButton format="heading-two" icon="looks_two" />
				<BlockButton format="block-quote" icon="format_quote" />
				<BlockButton format="numbered-list" icon="format_list_numbered" />
				<BlockButton format="bulleted-list" icon="format_list_bulleted" />
				<BlockButton format="left" icon="format_align_left" />
				<BlockButton format="center" icon="format_align_center" />
				<BlockButton format="right" icon="format_align_right" />
				<BlockButton format="justify" icon="format_align_justify" />
			</Toolbar>

			<Editable
				style={{
					padding: "0px 5px",
					margin: "-10px 0px 10px",
					minHeight: 200
				}}
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				// placeholder="Enter the problem description here..."
				spellCheck
				autoFocus
				onKeyDown={event => {
					for (const hotkey in HOTKEYS) {
						if (isHotkey(hotkey, event as any)) {
							event.preventDefault()
							const mark = HOTKEYS[hotkey]
							toggleMark(editor, mark)
						}
					}
				}}
			/>
		</Slate >
	)
}

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(
		editor,
		format,
		TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
	)
	const isList = LIST_TYPES.includes(format)

	Transforms.unwrapNodes(editor, {
		match: n =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			LIST_TYPES.includes(n.type) &&
			!TEXT_ALIGN_TYPES.includes(format),
		split: true,
	})
	let newProperties: Partial<SlateElement>
	if (TEXT_ALIGN_TYPES.includes(format)) {
		newProperties = {
			align: isActive ? undefined : format,
		}
	} else {
		newProperties = {
			type: isActive ? 'paragraph' : isList ? 'list-item' : format,
		}
	}
	Transforms.setNodes<SlateElement>(editor, newProperties)

	if (!isActive && isList) {
		const block = { type: format, children: [] }
		Transforms.wrapNodes(editor, block)
	}
}

const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}

const isBlockActive = (editor, format, blockType = 'type') => {
	const { selection } = editor
	if (!selection) return false

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: n =>
				!Editor.isEditor(n) &&
				SlateElement.isElement(n) &&
				n[blockType] === format,
		})
	)

	return !!match
}

const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor)
	return marks ? marks[format] === true : false
}


const Element = ({ attributes, children, element }) => {
	const style = { textAlign: element.align }
	switch (element.type) {
		case 'block-quote':
			return (

				<blockquote style={style} {...attributes}>
					{children}
				</blockquote>
			)
		case 'bulleted-list':
			return (
				<ul style={style} {...attributes}>
					{children}
				</ul>
			)
		case 'heading-one':
			return (
				<h1 style={style} {...attributes}>
					{children}
				</h1>
			)
		case 'heading-two':
			return (
				<h2 style={style} {...attributes}>
					{children}
				</h2>
			)
		case 'list-item':
			return (
				<li style={style} {...attributes}>
					{children}
				</li>
			)
		case 'numbered-list':
			return (
				<ol style={style} {...attributes}>
					{children}
				</ol>
			)
		default:
			return (
				<p style={style} {...attributes}>
					<Typography>{children}</Typography>
				</p>
			)
	}
}

const Leaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.code) {
		children = <code style={{
			background: "#e5e4e2",
			borderRadius: "5px"
		}}>{children}</code>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}

	if (leaf.underline) {
		children = <u>{children}</u>
	}

	return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
	const editor = useSlate()
	return (
		<Button
			active={isBlockActive(
				editor,
				format,
				TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
			)}
			onMouseDown={event => {
				event.preventDefault()
				toggleBlock(editor, format)
			}}
		>
			<Icon>{icon}</Icon>
		</Button>
	)
}

const MarkButton = ({ format, icon }) => {
	const editor = useSlate()
	return (
		<Button
			active={isMarkActive(editor, format)}
			onMouseDown={event => {
				event.preventDefault()
				toggleMark(editor, format)
			}}
		>
			<Icon>{icon}</Icon>
		</Button>
	)
}

export default RichText