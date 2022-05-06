import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Divider } from '@chakra-ui/react'
// prettier-ignore
import { Editor, EditorState, convertToRaw, RichUtils, getDefaultKeyBinding } from 'draft-js'

import InlineStyleControls from './editorStyles/InlineStyles'
import BlockStyleControls from './editorStyles/BlockStyles'

function TextEditor({ setBlogContent }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = editorState => {
    const contentState = editorState.getCurrentContent()
    // console.log('content state', convertToRaw(contentState))

    setEditorState(editorState)
    setBlogContent(convertToRaw(contentState))
  }

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  const mapKeyToEditorCommand = e => {
    if (e.keyCode === 9) {
      const newEditorState = RichUtils.onTab(e, editorState, 4)

      if (newEditorState !== editorState) {
        onEditorStateChange(newEditorState)
      }
      return
    }
    return getDefaultKeyBinding(e)
  }

  const toggleInlineStyle = inlineStyle => {
    onEditorStateChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  const toggleBlockType = blockType => {
    onEditorStateChange(RichUtils.toggleBlockType(editorState, blockType))
  }

  return (
    <Box borderWidth="2px" borderRadius="lg" p="4" h="100%" minH="300px" mb="2">
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <Divider my="4" />

      <Editor
        editorState={editorState}
        onChange={onEditorStateChange}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        spellCheck
      />
    </Box>
  )
}

TextEditor.propTypes = {
  setBlogContent: PropTypes.func,
}

export default TextEditor
