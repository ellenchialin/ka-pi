import PropTypes from 'prop-types'
import { Button } from '@chakra-ui/react'

const StyleButton = ({ style, onToggle, active, label }) => {
  const onToggleChange = e => {
    e.preventDefault()
    onToggle(style)
  }

  return (
    <Button
      as="button"
      w="40px"
      h="40px"
      borderRadius="lg"
      bg="#EDF2F7"
      color="gray.800"
      fontWeight="semibold"
      transition="all 0.2s"
      _hover={{ bg: '#464C5A', color: 'white' }}
      _active={{
        bg: '#464C5A',
        color: 'white',
        transform: 'scale(1.1)',
        borderColor: '#000',
      }}
      onMouseDown={onToggleChange}
      isActive={active ? true : false}
    >
      {label}
    </Button>
  )
}

StyleButton.propTypes = {
  style: PropTypes.string,
  onToggle: PropTypes.func,
  active: PropTypes.bool,
  label: PropTypes.string,
}

export default StyleButton
