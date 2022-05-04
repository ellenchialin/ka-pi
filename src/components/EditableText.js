import { useState, useEffect } from 'react'
import { Flex, Box, Text, IconButton } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'

function EditableText({
  text,
  type,
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
        <Flex align="center">
          <Text fontSize="24px" fontWeight="bold" mr="3">
            {text || placeholder}
          </Text>
          <IconButton
            aria-label={ariaLabel}
            icon={<EditIcon />}
            size="sm"
            isRound
            onClick={() => setEditing(true)}
          />
        </Flex>
      )}
    </Flex>
  )
}

export default EditableText
