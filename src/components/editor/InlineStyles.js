import PropTypes from 'prop-types'
import { ButtonGroup } from '@chakra-ui/react'
import StyleButton from './StyleButton'

const INLINE_STYLES = [
  { label: 'B', style: 'BOLD' },
  { label: 'I', style: 'ITALIC' },
  { label: 'U', style: 'UNDERLINE' },
]

const InlineStyleControls = ({ editorState, onToggle }) => {
  const currentStyle = editorState.getCurrentInlineStyle()

  return (
    <ButtonGroup spacing="4" mb="4" className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </ButtonGroup>
  )
}

InlineStyleControls.propTypes = {
  editorState: PropTypes.object,
  onToggle: PropTypes.func,
}

export default InlineStyleControls
