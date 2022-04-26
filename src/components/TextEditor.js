import { useState, useCallback } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, RichUtils } from 'draft-js'
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const wrapperStyle = {
    border: '1px solid #ccc',
  }
  const editorStyle = {
    padding: '1rem',
  }

  const toolbarStyle = {
    border: '1px solid #ccc',
  }

  const onEditorStateChange = editorState => {
    setEditorState(editorState)
  }

  return (
    <>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperStyle={wrapperStyle}
        editorStyle={editorStyle}
        toolbarStyle={toolbarStyle}
      />
    </>
  )
}

export default TextEditor
