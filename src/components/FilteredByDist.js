import { useState, useEffect } from 'react'
// prettier-ignore
import { useCheckboxGroup, Flex, Button } from '@chakra-ui/react'
import { areaData } from '../cityData'
import CustomCheckbox from '../components/CustomCheckbox'

function FilterByDist({
  cityCafes,
  translatedCityName,
  setSelectedAreas,
  setUpdatedCafes,
}) {
  const [cityAreas, setCityAreas] = useState([])
  const { value, getCheckboxProps, setValue } = useCheckboxGroup()

  useEffect(() => {
    checkAvailableAreas()
  }, [])

  const checkAvailableAreas = () => {
    const allAreas = areaData[translatedCityName]
    const filteredAreas = allAreas.filter(area => {
      return cityCafes.some(cafe => {
        return cafe.address.includes(area)
      })
    })
    setCityAreas(filteredAreas)
    // console.log('Filtered Areas: ', filteredAreas)
  }

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
            {...getCheckboxProps({ value: area, text: area })}
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
