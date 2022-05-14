import { useState } from 'react'
// prettier-ignore
import { Button, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverArrow, useDisclosure, Wrap, WrapItem, Portal } from '@chakra-ui/react'
import CustomCheckbox from './CustomCheckbox'
import { cityData, areaData } from '../cityData'
import PropTypes from 'prop-types'
import CustomRadio from './CustomRadio'

const PopoverCityFilter = ({
  filteredCafes,
  setDistrictFilteredCafes,
  filterCityValue,
  getCityRadioProps,
  filterDistrictValue,
  getDistrictCheckboxProps,
  getRootProps,
  setCurrentPage,
}) => {
  const [cityFilteredCafes, setCityFilteredCafes] = useState([])
  const [showDistricts, setShowDistricts] = useState(false)
  const [cityDistricts, setCityDistricts] = useState(null)

  const cities = cityData.map(city => city.place)

  const selectCity = () => {
    const results = filteredCafes.filter(cafe =>
      cafe.address.includes(filterCityValue)
    )
    console.log('results: ', results)
    setCityFilteredCafes(results)

    const allDistricts = areaData[filterCityValue]
    const filteredDistricts = allDistricts.filter(dist => {
      return results.some(cafe => {
        return cafe.address.includes(dist)
      })
    })

    console.log('Available City Districts', filteredDistricts)
    setCityDistricts(filteredDistricts)
    setShowDistricts(true)
  }

  const filterDistrict = () => {
    console.log('filter District Value', filterDistrictValue)

    const results = cityFilteredCafes.filter(cafe => {
      return filterDistrictValue.some(d => {
        return cafe.address.includes(d)
      })
    })
    setDistrictFilteredCafes(results)
    setCurrentPage(1)
  }

  const {
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
    isOpen: isPopoverOpen,
  } = useDisclosure()

  return (
    <Popover
      isOpen={isPopoverOpen}
      onOpen={onPopoverOpen}
      onClose={onPopoverClose}
      placement="bottom-end"
      variant="search"
      closeOnBlur
      flip={false}
    >
      <PopoverTrigger>
        <Button
          variant="auth-buttons"
          fontWeight="normal"
          px="6"
          h="8"
          alignSelf="flex-end"
        >
          篩選城市
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          w="100%"
          maxW="310px"
          px="4"
          pt="8"
          pb="6"
          color="white"
        >
          <PopoverArrow />
          <PopoverCloseButton color="primaryDark" bg="secondaryLight" />

          <Wrap spacing="10px" justify="center" mb="2" {...getRootProps()}>
            {cityDistricts
              ? cityDistricts.map(d => (
                  <WrapItem key={d}>
                    <CustomCheckbox
                      {...getDistrictCheckboxProps({
                        value: d,
                        text: d,
                      })}
                    />
                  </WrapItem>
                ))
              : cities.map(city => (
                  <WrapItem key={city}>
                    <CustomRadio
                      {...getCityRadioProps({
                        value: city,
                        text: city,
                      })}
                    />
                  </WrapItem>
                ))}
          </Wrap>
          <Button
            w="100%"
            maxW="110px"
            bg="secondaryDark"
            color="primaryLight"
            _hover={{
              bg: 'thirdDark',
            }}
            fontWeight="normal"
            alignSelf="center"
            p="4"
            mt="2"
            h="8"
            isDisabled={filterCityValue.length === 0 ? true : false}
            onClick={showDistricts ? filterDistrict : selectCity}
          >
            {showDistricts ? '搜尋' : '選擇'}
          </Button>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

PopoverCityFilter.propTypes = {
  filteredCafes: PropTypes.array,
  setDistrictFilteredCafes: PropTypes.func,
  filterCityValue: PropTypes.string,
  filterDistrictValue: PropTypes.array,
  getCityCheckboxProps: PropTypes.func,
  setCurrentPage: PropTypes.func,
  getCityRadioProps: PropTypes.func,
  getDistrictCheckboxProps: PropTypes.func,
  getRootProps: PropTypes.func,
}

export default PopoverCityFilter
