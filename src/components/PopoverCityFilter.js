// prettier-ignore
import { Button, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverArrow, useDisclosure, Wrap, WrapItem, Portal } from '@chakra-ui/react'
import CustomCheckbox from './CustomCheckbox'
import { cityData } from '../cityData'
import PropTypes from 'prop-types'

const PopoverCityFilter = ({
  filteredCafes,
  setAdvacedFilteredCafes,
  filterCityValue,
  getCityCheckboxProps,
}) => {
  const cities = cityData.map(city => city.tag)

  const advancedSearch = () => {
    const results = filteredCafes.filter(cafe => {
      return filterCityValue.some(city => {
        return cafe.address.includes(city)
      })
    })
    setAdvacedFilteredCafes(results)
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
          Filter by city
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

          <Wrap spacing="10px" justify="center" mb="2">
            {cityData.map(city => (
              <WrapItem key={city.tag}>
                <CustomCheckbox
                  {...getCityCheckboxProps({
                    value: city.place,
                    text: city.tag,
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
            onClick={advancedSearch}
          >
            Search
          </Button>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

PopoverCityFilter.propTypes = {
  filteredCafes: PropTypes.array,
  setAdvacedFilteredCafes: PropTypes.func,
  filterCityValue: PropTypes.array,
  getCityCheckboxProps: PropTypes.func,
}

export default PopoverCityFilter
