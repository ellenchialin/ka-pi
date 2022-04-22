import { useState } from 'react'
// prettier-ignore
import { useCheckbox,chakra,Box,Text,useCheckboxGroup,Heading,Flex,Button,Spinner,Tag,TagLeftIcon,TagLabel, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverArrow, Stack, useDisclosure } from '@chakra-ui/react'
import { FaHashtag } from 'react-icons/fa'
import CafeCard from '../../components/cafe/CafeCard'
import Pagination from '../../components/Pagination'
import usePageTracking from '../../usePageTracking'
import { cityData } from '../../cityData'

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
        {props.text}
      </Text>
    </chakra.label>
  )
}

const PopoverFilter = ({ filteredCafes, setAdvacedFilteredCafes }) => {
  const cities = cityData.map(city => city.place)

  const { value: filterCityValue, getCheckboxProps } = useCheckboxGroup()
  // console.log('selected city: ', filterCityValue)

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
      placement="left"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Button
          colorScheme="blackAlpha"
          variant="solid"
          fontSize="0.875rem"
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
      <PopoverContent w="200px" px={5} py={8} bg="gray.800" color="white">
        <PopoverArrow />
        <PopoverCloseButton />

        <Flex wrap="wrap">
          {cities.map(city => (
            <CustomCheckbox
              key={city}
              {...getCheckboxProps({ value: city, text: city })}
            />
          ))}
        </Flex>
        <Button
          variant="solid"
          fontSize="0.875rem"
          fontWeight="normal"
          color="gray.800"
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

function SearchByFeature() {
  usePageTracking()
  const [filteredCafes, setFilteredCafes] = useState([])
  const [advacedFilteredCafes, setAdvacedFilteredCafes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(20)
  const [isLoading, setIsLoading] = useState(false)

  const indexOfLastCafe = currentPage * cafesPerPage
  const indexOfFirstCafe = indexOfLastCafe - cafesPerPage
  const currentCafes =
    advacedFilteredCafes.length > 0
      ? advacedFilteredCafes.slice(indexOfFirstCafe, indexOfLastCafe)
      : filteredCafes.slice(indexOfFirstCafe, indexOfLastCafe)
  const paginate = pageNumber => setCurrentPage(pageNumber)

  const defaultFeatures = ['不限時', '有插座']
  const ratingFeatures = [
    { text: 'WiFi穩定', tag: 'wifi' },
    { text: '通常有位', tag: 'seat' },
    { text: '店內安靜', tag: 'quiet' },
    { text: '咖啡好喝', tag: 'tasty' },
    { text: '價格親民', tag: 'cheap' },
    { text: '裝潢音樂', tag: 'music' },
  ]

  // console.log('Filter by city: ', advacedFilteredCafes.length)

  const { value, getCheckboxProps, setValue } = useCheckboxGroup()
  // console.log('Selected features: ', value)

  const handleFeatureSearch = () => {
    setIsLoading(true)

    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
      .then(data => {
        const defaultMatched = data.filter(
          cafe => cafe.limited_time === 'no' && cafe.socket === 'yes'
        )

        const filterResults = defaultMatched.filter(cafe => {
          return value.some(feature => {
            return cafe[feature] >= 5
          })
        })

        setFilteredCafes(filterResults)
      })
      .catch(error => {
        alert('篩選發生錯誤，請確認網路連線，或聯繫開發人員')
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  const handleResetFilter = () => {
    setValue([])
    setFilteredCafes([])
    setAdvacedFilteredCafes([])
  }

  return (
    <Flex as="section" direction="column" alignItems="center">
      <Heading as="h2" size="lg" mb="3">
        根據需求，快速找到符合的咖啡廳
      </Heading>
      <Flex w="400px" justify="center" align="center" direction="column" mb="3">
        <Text>預設必備條件</Text>
        <Flex>
          {defaultFeatures.map((feature, i) => (
            <Tag key={i} size="md" colorScheme="messenger">
              <TagLeftIcon boxSize="12px" as={FaHashtag} />
              <TagLabel>{feature}</TagLabel>
            </Tag>
          ))}
        </Flex>
      </Flex>
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
          {ratingFeatures.map(feature => (
            <CustomCheckbox
              key={feature.tag}
              mb="3"
              {...getCheckboxProps({ value: feature.tag, text: feature.text })}
            />
          ))}
        </Flex>
        <Flex w="60%" justify="space-evenly">
          <Button
            colorScheme="pink"
            variant="solid"
            fontSize="0.875rem"
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
            fontSize="0.875rem"
            fontWeight="normal"
            px="6"
            h="8"
            onClick={handleFeatureSearch}
            isDisabled={value.length === 0 ? true : false}
          >
            條件搜尋
          </Button>
        </Flex>
      </Flex>

      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.600"
          siz="xl"
          mt="6"
        />
      ) : (
        <Flex direction="column" align="center">
          <Text my="3">
            共篩選{' '}
            {advacedFilteredCafes.length > 0
              ? advacedFilteredCafes.length
              : filteredCafes.length}{' '}
            間咖啡廳
          </Text>
          <PopoverFilter
            filteredCafes={filteredCafes}
            setAdvacedFilteredCafes={setAdvacedFilteredCafes}
          />
          <Flex
            w="100%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            as="section"
          >
            {currentCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </Flex>
          <Pagination
            cafesPerPage={cafesPerPage}
            totalCafes={
              advacedFilteredCafes.length > 0
                ? advacedFilteredCafes.length
                : filteredCafes.length
            }
            paginate={paginate}
          />
        </Flex>
      )}
    </Flex>
  )
}

export default SearchByFeature
