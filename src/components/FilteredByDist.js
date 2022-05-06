import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// prettier-ignore
import { useCheckboxGroup, Flex, Button, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react'
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
  }

  const handleResetFilter = () => {
    setValue([])
    setUpdatedCafes([])
  }

  const bgColor = useColorModeValue('gray.200', 'primaryLight')

  return (
    <Flex
      direction="column"
      align="center"
      bg={bgColor}
      px="4"
      py="6"
      mb="10"
      borderRadius="xl"
    >
      <Wrap spacing="10px" justify="center" mb="4">
        {cityAreas.map(area => (
          <WrapItem key={area}>
            <CustomCheckbox
              {...getCheckboxProps({ value: area, text: area })}
            />
          </WrapItem>
        ))}
      </Wrap>

      <Wrap spacing="10px" justify="center">
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
      </Wrap>
    </Flex>
  )
}

FilterByDist.propTypes = {
  cityCafes: PropTypes.array,
  translatedCityName: PropTypes.string,
  setSelectedAreas: PropTypes.func,
  setUpdatedCafes: PropTypes.func,
}

export default FilterByDist
