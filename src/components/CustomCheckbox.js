import { useCheckbox, chakra, Box, Text, Flex } from '@chakra-ui/react'
import PropTypes from 'prop-types'

const CustomCheckbox = props => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
    useCheckbox(props)

  return (
    <chakra.label
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gridColumnGap={2}
      w="100%"
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

CustomCheckbox.propTypes = {
  text: PropTypes.string.isRequired,
}

export default CustomCheckbox
