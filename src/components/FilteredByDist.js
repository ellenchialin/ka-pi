import { useState } from 'react'
// prettier-ignore
import { useCheckbox, chakra, Box, Text, useCheckboxGroup, Flex, Button } from '@chakra-ui/react'
import { areaData } from '../cityData'

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
      <Text {...getLabelProps()}>{props.value}</Text>
    </chakra.label>
  )
}

function FilterByDist({
  translatedCityName,
  setSelectedAreas,
  setUpdatedCafes,
}) {
  // console.log('translated City Name: ', translatedCityName)
  const [cityAreas, setCityAreas] = useState(areaData[translatedCityName])
  const { value, getCheckboxProps, setValue } = useCheckboxGroup()

  const handleResetFilter = () => {
    setValue([])
    setUpdatedCafes([])
  }

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

      <Flex w="60%" justify="space-evenly">
        <Button
          colorScheme="pink"
          variant="solid"
          fontWeight="normal"
          px="6"
          h="8"
          isDisabled={value.length === 0 ? true : false}
          onClick={handleResetFilter}
        >
          清除全部
        </Button>
        <Button
          colorScheme="blackAlpha"
          variant="solid"
          fontWeight="normal"
          px="6"
          h="8"
          onClick={() => setSelectedAreas(value)}
          isDisabled={value.length === 0 ? true : false}
        >
          搜尋
        </Button>
      </Flex>
    </Flex>
  )
}
export default FilterByDist
