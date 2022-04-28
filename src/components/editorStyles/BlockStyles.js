import { HStack } from '@chakra-ui/react'
import StyleButton from './StyleButton'

const BLOCK_TYPE_HEADINGS = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
]

const BlockStyleControls = ({ editorState, onToggle }) => {
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <HStack spacing="4">
      {BLOCK_TYPE_HEADINGS.map(heading => (
        <StyleButton
          key={heading.label}
          active={heading.style === blockType}
          label={heading.label}
          onToggle={onToggle}
          style={heading.style}
        />
      ))}
    </HStack>
  )
}

export default BlockStyleControls
