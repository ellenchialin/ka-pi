import PropTypes from 'prop-types'
import { Flex } from '@chakra-ui/react'
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
    <Flex w="100%" maxW="320px" mb="4" justify="space-between" flexWrap="wrap">
      {BLOCK_TYPE_HEADINGS.map(heading => (
        <StyleButton
          key={heading.label}
          active={heading.style === blockType}
          label={heading.label}
          onToggle={onToggle}
          style={heading.style}
        />
      ))}
    </Flex>
  )
}

BlockStyleControls.propTypes = {
  editorState: PropTypes.object,
  onToggle: PropTypes.func,
}

export default BlockStyleControls
