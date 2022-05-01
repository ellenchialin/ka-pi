import { useState } from 'react'
// prettier-ignore
import { useCheckbox,chakra,Box,Text,useCheckboxGroup,Heading,Flex,Button,Spinner,Tag,TagLeftIcon,TagLabel, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverArrow, SimpleGrid, useDisclosure, HStack } from '@chakra-ui/react'
import { FaHashtag } from 'react-icons/fa'
import CafeCard from '../../components/cafe/CafeCard'
import Pagination from '@choc-ui/paginator'
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
      maxW="32"
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
      <Text {...getLabelProps()}>{props.text}</Text>
    </chakra.label>
  )
}

const PopoverFilter = ({ filteredCafes, setAdvacedFilteredCafes }) => {
  const cities = cityData.map(city => city.place)

  const { value: filterCityValue, getCheckboxProps } = useCheckboxGroup()

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

function SearchByFeature() {
  usePageTracking()
  const [filteredCafes, setFilteredCafes] = useState([])
  const [advacedFilteredCafes, setAdvacedFilteredCafes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(20)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes =
    advacedFilteredCafes.length > 0
      ? advacedFilteredCafes.slice(offset, offset + cafesPerPage)
      : filteredCafes.slice(offset, offset + cafesPerPage)

  const defaultFeatures = ['不限時', '有插座']
  const ratingFeatures = [
    { text: 'WiFi穩定', tag: 'wifi' },
    { text: '通常有位', tag: 'seat' },
    { text: '店內安靜', tag: 'quiet' },
    { text: '咖啡好喝', tag: 'tasty' },
    { text: '價格親民', tag: 'cheap' },
    { text: '裝潢音樂', tag: 'music' },
  ]

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
    <Flex as="section" direction="column" alignItems="center" wrap="wrap">
      <Heading as="h2" size="lg" mb="3">
        根據需求，快速搜尋
      </Heading>
      <Flex w="400px" justify="center" align="center" direction="column" mb="4">
        <Text>預設必備條件</Text>
        <HStack spacing="15px">
          {defaultFeatures.map((feature, i) => (
            <Tag key={i} size="md" colorScheme="messenger">
              <TagLeftIcon boxSize="12px" as={FaHashtag} />
              <TagLabel>{feature}</TagLabel>
            </Tag>
          ))}
        </HStack>
      </Flex>
      <Flex
        direction="column"
        align="center"
        bg="gray.200"
        color="primaryDark"
        px="6"
        py="6"
        mb="12"
        borderRadius="xl"
      >
        <SimpleGrid
          w="full"
          columns={[2, 3, 3, 4]}
          spacing="15px"
          justifyItems="center"
          alignItems="center"
          mb="4"
        >
          {ratingFeatures.map(feature => (
            <CustomCheckbox
              key={feature.tag}
              {...getCheckboxProps({ value: feature.tag, text: feature.text })}
            />
          ))}
        </SimpleGrid>
        <HStack spacing="20px">
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
            onClick={handleFeatureSearch}
            isDisabled={value.length === 0 ? true : false}
          >
            條件搜尋
          </Button>
        </HStack>
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
          {filteredCafes.length > 0 && (
            <>
              <Text my="3" alignSelf="flex-end">
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
            </>
          )}
          <SimpleGrid
            w="full"
            columns={[1, 2, 2, 3]}
            spacing="20px"
            justifyItems="center"
            mb="4"
          >
            {currentCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </SimpleGrid>
          <Pagination
            defaultCurrent={1}
            total={
              advacedFilteredCafes.length > 0
                ? advacedFilteredCafes.length
                : filteredCafes.length
            }
            current={currentPage}
            onChange={page => setCurrentPage(page)}
            pageSize={cafesPerPage}
            paginationProps={{
              display: 'flex',
              justifyContent: 'center',
            }}
            pageNeighbours={2}
            rounded="full"
            baseStyles={{ bg: 'transparent' }}
            activeStyles={{ bg: 'gray.400' }}
            hoverStyles={{ bg: 'gray.400' }}
            responsive={{ activePage: true }}
          />
        </Flex>
      )}
    </Flex>
  )
}

export default SearchByFeature
