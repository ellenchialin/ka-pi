import { useState } from 'react'
import { Editor, EditorState, convertToRaw, RichUtils } from 'draft-js'

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  console.log('Inside editor state: ', editorState)

  const onEditorStateChange = editorState => {
    setEditorState(editorState)
  }

  return (
    <Editor
      editorState={editorState}
      onChange={onEditorStateChange}
      spellCheck
    />
  )
}

export default TextEditor
