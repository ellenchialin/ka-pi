// prettier-ignore
import { useCheckboxGroup, Flex, Button, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverArrow, useDisclosure, Wrap, WrapItem } from '@chakra-ui/react'
import CustomCheckbox from './CustomCheckbox'
import { cityData } from '../cityData'

const PopoverCityFilter = ({ filteredCafes, setAdvacedFilteredCafes }) => {
  // console.log('Before filtered by city: ', filteredCafes)

  const cities = cityData.map(city => city.place)

  const { value: filterCityValue, getCheckboxProps } = useCheckboxGroup()

  const advancedSearch = () => {
    const results = filteredCafes.filter(cafe => {
      return filterCityValue.some(city => {
        return cafe.address.includes(city)
      })
    })
    // console.log('Filtered by city: ', results)
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
          onClick={() => console.log('Click city')}
        >
          進階搜尋
        </Button>
      </PopoverTrigger>
      <PopoverContent w="100%" maxW="310px" px="4" pt="8" pb="6" color="white">
        <PopoverArrow />
        <PopoverCloseButton color="primaryDark" bg="secondaryLight" />

        <Wrap spacing="10px" justify="center" mb="2">
          {cities.map(city => (
            <WrapItem key={city}>
              <CustomCheckbox
                {...getCheckboxProps({ value: city, text: city })}
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
          搜尋
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverCityFilter
