import { useState, useCallback } from 'react'
// prettier-ignore
import { Editor, EditorState, convertToRaw, RichUtils, getDefaultKeyBinding } from 'draft-js'

import { Flex, Button } from '@chakra-ui/react'

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
]

const InlineStyleControls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle()

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <Button
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = editorState => {
    setEditorState(editorState)
  }

  const handleKeyCommand = useCallback((command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  })

  const mapKeyToEditorCommand = e => {
    if (e.keyCode === 9) {
      const newEditorState = RichUtils.onTab(e, editorState, 4)
      if (newEditorState !== editorState) {
        setEditorState(newEditorState)
      }
      return
    }
    return getDefaultKeyBinding(e)
  }

  const toggleInlineStyle = inlineStyle => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  const onBoldClick = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
  })

  return (
    <div>
      {/*<InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />*/}
      <Flex>
        <Button onClick={onBoldClick}>B</Button>
      </Flex>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        spellCheck
      />
    </div>
  )
}

export default TextEditor
