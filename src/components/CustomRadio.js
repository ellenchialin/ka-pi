import { useRadio, chakra, Box, Text, Flex } from '@chakra-ui/react'
import React from 'react'

function CustomRadio(props) {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
    useRadio(props)

  return (
    <chakra.label
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gridColumnGap={2}
      maxW="32"
      bg="transparent"
      border="1px solid"
      borderColor="thirdDark"
      rounded="lg"
      px={3}
      py={1}
      cursor="pointer"
      {...htmlProps}
    >
      <input {...getInputProps()} />
      <Flex
        alignItems="center"
        justifyContent="center"
        border="2px solid"
        borderColor="thirdDark"
        w={4}
        h={4}
        {...getCheckboxProps()}
      >
        {state.isChecked && <Box w={2} h={2} bg="thirdDark" />}
      </Flex>
      <Text color="primaryDark" {...getLabelProps()}>
        {props.text}
      </Text>
    </chakra.label>
  )
}

export default CustomRadio
