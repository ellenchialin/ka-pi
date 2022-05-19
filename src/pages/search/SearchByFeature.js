import { useState, useRef } from 'react'
// prettier-ignore
import { Text, useCheckboxGroup, Heading, Flex, Button, Tag, TagLeftIcon, TagLabel, SimpleGrid, HStack, Wrap, WrapItem, VStack, useRadioGroup, useDisclosure, useColorModeValue } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

import { api } from '../../utils/api'
import PopoverCityFilter from '../../components/PopoverCityFilter'
import CustomCheckbox from '../../components/CustomCheckbox'
import CafeCard from '../../components/cafe/CafeCard'
import CustomSpinner from '../../components/CustomSpinner'
import AlertModal from '../../components/AlertModal'
import CustomPagination from '../../components/CustomPagination'
import usePageTracking from '../../usePageTracking'

function SearchByFeature() {
  usePageTracking()
  const [filteredCafes, setFilteredCafes] = useState([])
  const [districtFilteredCafes, setDistrictFilteredCafes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollToTopRef = useRef(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(20)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes =
    districtFilteredCafes.length > 0
      ? districtFilteredCafes.slice(offset, offset + cafesPerPage)
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

  const {
    value: featureValue,
    getCheckboxProps,
    setValue: setFeatureValue,
  } = useCheckboxGroup()

  const {
    value: filterCityValue,
    getRadioProps: getCityRadioProps,
    getRootProps,
    setValue: setCityValue,
  } = useRadioGroup()

  const {
    value: filterDistrictValue,
    getCheckboxProps: getDistrictCheckboxProps,
    setValue: setDistrictValue,
  } = useCheckboxGroup()

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const handleFeatureSearch = () => {
    setIsLoading(true)
    setCityValue([])

    api
      .getAllCafes()
      .then(data => {
        const defaultMatched = data.filter(
          cafe => cafe.limited_time === 'no' && cafe.socket === 'yes'
        )

        const filterResults = defaultMatched.filter(cafe => {
          return featureValue.some(feature => {
            return cafe[feature] >= 5
          })
        })

        setFilteredCafes(filterResults)
        setCurrentPage(1)
      })
      .catch(error => {
        onAlertOpen()
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  const handleResetFilter = () => {
    setFeatureValue([])
    setCityValue([])
    setDistrictValue([])
    setFilteredCafes([])
    setDistrictFilteredCafes([])
  }

  const filterBoxShadow = useColorModeValue(
    'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
    'rgba(204,204,204,0.6) 1.95px 1.95px 2.6px'
  )

  return (
    <Flex
      w="full"
      maxW="1170px"
      h="100%"
      as="section"
      direction="column"
      alignItems="center"
      wrap="wrap"
    >
      <Heading as="h1" mb="3" fontSize={{ base: '28px', md: '40px' }}>
        根據需求，快速搜尋
      </Heading>
      <Text fontSize={{ base: '16px', md: '18px' }}>預設必備條件</Text>
      <Wrap spacing="15px" justify="center" mb="4">
        {defaultFeatures.map((feature, i) => (
          <WrapItem key={i}>
            <Tag
              size="lg"
              color="primaryDark"
              bg="gray.200"
              boxShadow={filterBoxShadow}
            >
              <TagLeftIcon boxSize="12px" as={CheckIcon} />
              <TagLabel>{feature}</TagLabel>
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
      <Flex
        direction="column"
        align="center"
        bg="gray.100"
        color="primaryDark"
        px="6"
        py="6"
        mb="8"
        borderRadius="xl"
        boxShadow={filterBoxShadow}
      >
        <Wrap spacing="10px" justify="center" mb="4">
          {ratingFeatures.map(feature => (
            <WrapItem key={feature.tag}>
              <CustomCheckbox
                {...getCheckboxProps({
                  value: feature.tag,
                  text: feature.text,
                })}
              />
            </WrapItem>
          ))}
        </Wrap>
        <HStack spacing="15px">
          <Button
            colorScheme="pink"
            variant="solid"
            fontWeight="normal"
            px="6"
            h="8"
            isDisabled={featureValue.length === 0 ? true : false}
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
            isDisabled={featureValue.length === 0 ? true : false}
          >
            條件搜尋
          </Button>
        </HStack>
      </Flex>

      {isLoading ? (
        <CustomSpinner />
      ) : (
        <Flex w="full" direction="column" align="center" ref={scrollToTopRef}>
          {filteredCafes.length > 0 && (
            <VStack alignSelf="flex-end" mb="4">
              <Text mb="2" alignSelf="flex-end">
                {districtFilteredCafes.length > 0
                  ? districtFilteredCafes.length
                  : filteredCafes.length}{' '}
                間符合
              </Text>
              <PopoverCityFilter
                filteredCafes={filteredCafes}
                setDistrictFilteredCafes={setDistrictFilteredCafes}
                filterCityValue={filterCityValue}
                getCityRadioProps={getCityRadioProps}
                filterDistrictValue={filterDistrictValue}
                getDistrictCheckboxProps={getDistrictCheckboxProps}
                getRootProps={getRootProps}
                setCurrentPage={setCurrentPage}
              />
            </VStack>
          )}
          <SimpleGrid
            w="full"
            minChildWidth="270px"
            spacing="20px"
            mb="6"
            justifyItems="center"
          >
            {currentCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </SimpleGrid>
          {filteredCafes.length > cafesPerPage ||
          districtFilteredCafes.length > cafesPerPage ? (
            <CustomPagination
              total={
                districtFilteredCafes.length > 0
                  ? districtFilteredCafes.length
                  : filteredCafes.length
              }
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              cardsPerPage={cafesPerPage}
              scrollToTopRef={scrollToTopRef}
            />
          ) : (
            ''
          )}
        </Flex>
      )}
      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader="Oops! 暫無法取得資料"
        alertBody="請確認網路連線並重新操作，多次失敗請聯繫開發人員 chialin76@gmail.com "
      />
    </Flex>
  )
}

export default SearchByFeature
