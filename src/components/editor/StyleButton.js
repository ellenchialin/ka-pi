import PropTypes from 'prop-types'
import { Button, Text } from '@chakra-ui/react'

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
      <Text
        textDecoration={label === 'U' ? 'underline' : ''}
        fontWeight={label === 'B' ? 'bold' : 'medium'}
        as={label === 'I' ? 'i' : ''}
      >
        {label}
      </Text>
    </Button>
  )
}

StyleButton.propTypes = {
  style: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
}

export default StyleButton
