import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// prettier-ignore
import { useCheckboxGroup, Flex, Button, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react'

import { areaData } from '../../cityData'
import CustomCheckbox from '../shared/CustomCheckbox'

function DistrictFilterBoard({
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

  const filterBoxShadow = useColorModeValue(
    'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
    'rgba(204,204,204,0.6) 1.95px 1.95px 2.6px'
  )

  return (
    <Flex
      direction="column"
      align="center"
      bg="gray.100"
      boxShadow={filterBoxShadow}
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

DistrictFilterBoard.propTypes = {
  cityCafes: PropTypes.array.isRequired,
  translatedCityName: PropTypes.string.isRequired,
  setSelectedAreas: PropTypes.func.isRequired,
  setUpdatedCafes: PropTypes.func.isRequired,
}

export default DistrictFilterBoard
