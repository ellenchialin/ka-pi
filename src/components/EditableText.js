import { useState, useEffect } from 'react'
import { Flex, Box, Text, IconButton } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import PropTypes from 'prop-types'

function EditableText({
  text,
  placeholder,
  children,
  childRef,
  ariaLabel,
  ...props
}) {
  const [isEditing, setEditing] = useState(false)

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus()
    }
  }, [isEditing, childRef])

  return (
    <Flex {...props}>
      {isEditing ? (
        <Box h="36px" onBlur={() => setEditing(false)}>
          {children}
        </Box>
      ) : (
        <Flex align="center" position="relative">
          <Text fontSize={{ base: '18px', md: '24px' }} fontWeight="semibold">
            {text || placeholder}
          </Text>
          <IconButton
            aria-label={ariaLabel}
            icon={<EditIcon />}
            size="sm"
            isRound
            position="absolute"
            right="-40px"
            onClick={() => setEditing(true)}
          />
        </Flex>
      )}
    </Flex>
  )
}

EditableText.propTypes = {
  text: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  childRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]).isRequired,
  ariaLabel: PropTypes.string.isRequired,
}

export default EditableText
