// prettier-ignore
import { useCheckboxGroup, Flex, Button, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverArrow, useDisclosure } from '@chakra-ui/react'
import CustomCheckbox from './CustomCheckbox'
import { cityData } from '../cityData'

const PopoverCityFilter = ({ filteredCafes, setAdvacedFilteredCafes }) => {
  console.log('Before filtered by city: ', filteredCafes)

  const cities = cityData.map(city => city.place)

  const { value: filterCityValue, getCheckboxProps } = useCheckboxGroup()

  const advancedSearch = () => {
    const results = filteredCafes.filter(cafe => {
      return filterCityValue.some(city => {
        return cafe.address.includes(city)
      })
    })
    console.log('Filtered by city: ', results)
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
      placement="left"
      variant="search"
      closeOnBlur
    >
      <PopoverTrigger>
        <Button
          variant="auth-buttons"
          fontWeight="normal"
          px="6"
          h="8"
          mb="3"
          alignSelf="flex-end"
          onClick={() => console.log('Click city')}
        >
          進階搜尋
        </Button>
      </PopoverTrigger>
      <PopoverContent w="240px" px={5} py={8} color="white">
        <PopoverArrow />
        <PopoverCloseButton />

        <Flex justify="space-between" wrap="wrap">
          {cities.map(city => (
            <CustomCheckbox
              key={city}
              {...getCheckboxProps({ value: city, text: city })}
            />
          ))}
        </Flex>
        <Button
          bg="secondaryDark"
          color="primaryLight"
          _hover={{
            bg: 'thirdDark',
          }}
          fontWeight="normal"
          px="6"
          h="8"
          mt="2"
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
