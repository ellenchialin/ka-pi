import { useState } from 'react'
import { Editor, EditorState, convertToRaw, RichUtils } from 'draft-js'

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = editorState => {
    setEditorState(editorState)
  }

  return <Editor editorState={editorState} onChange={onEditorStateChange} />
}

export default TextEditor
