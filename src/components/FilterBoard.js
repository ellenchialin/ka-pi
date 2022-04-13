import { useState } from 'react'
import {
  useCheckbox,
  chakra,
  Box,
  Text,
  useCheckboxGroup,
  Flex,
  Button,
} from '@chakra-ui/react'
import { areaData } from '../cityData'

function FilterBoard({ translatedCityName, setSelectedAreas }) {
  console.log('translated City Name: ', translatedCityName)

  const [cityAreas, setCityAreas] = useState(areaData[translatedCityName])

  function CustomCheckbox(props) {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
      useCheckbox(props)

    return (
      <chakra.label
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gridColumnGap={2}
        maxW="28"
        bg="transparent"
        border="1px solid"
        borderColor="gray.500"
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
          borderColor="gray.500"
          w={4}
          h={4}
          {...getCheckboxProps()}
        >
          {state.isChecked && <Box w={2} h={2} bg="gray.500" />}
        </Flex>
        <Text fontSize="0.875rem" {...getLabelProps()}>
          {props.value}
        </Text>
      </chakra.label>
    )
  }

  const { value, getCheckboxProps } = useCheckboxGroup()
  // console.log(value)

  return (
    <Flex
      direction="column"
      align="center"
      bg="gray.200"
      px="4"
      py="6"
      mb="12"
      borderRadius="xl"
    >
      <Flex wrap="wrap" justify="space-evenly">
        {cityAreas.map(area => (
          <CustomCheckbox
            key={area}
            mb="3"
            {...getCheckboxProps({ value: area })}
          />
        ))}
      </Flex>
      <Button
        colorScheme="blackAlpha"
        variant="solid"
        fontSize="0.875rem"
        fontWeight="normal"
        px="6"
        h="8"
        onClick={() => setSelectedAreas(value)}
      >
        搜尋
      </Button>
    </Flex>
  )
}
export default FilterBoard
