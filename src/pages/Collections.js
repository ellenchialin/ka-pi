import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Text, Tag, TagLeftIcon, TagLabel, SimpleGrid, Wrap, WrapItem, VStack, useCheckboxGroup, useDisclosure, useRadioGroup, useColorModeValue } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

import { api } from '../utils/api'
import PopoverCityFilter from '../components/shared/PopoverCityFilter'
import CafeCard from '../components/cafe/CafeCard'
import CustomSpinner from '../components/shared/CustomSpinner'
import CustomPagination from '../components/shared/CustomPagination'
import AlertModal from '../components/shared/AlertModal'
import usePageTracking from '../hooks/usePageTracking'

const workLabels = ['不限時', '夠安靜', '有插座', 'WiFi穩定']
const hangoutLabels = ['不限時', '裝潢音樂', '通常有位']

function Collections() {
  usePageTracking()
  const { type } = useParams()
  const [collectionType, setCollectionType] = useState(type)
  const [cafesForWork, setCafesForWork] = useState([])
  const [cafesForHangout, setCafesForHangout] = useState([])
  const [districtFilteredCafes, setDistrictFilteredCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollToTopRef = useRef(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(20)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes =
    districtFilteredCafes.length > 0
      ? districtFilteredCafes.slice(offset, offset + cafesPerPage)
      : collectionType === 'work'
      ? cafesForWork.slice(offset, offset + cafesPerPage)
      : cafesForHangout.slice(offset, offset + cafesPerPage)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

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

  useEffect(() => {
    setCollectionType(type)
    setCurrentPage(1)
    setDistrictFilteredCafes([])
    setCityValue([])
    setDistrictValue([])
    scrollToTopRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [type])

  useEffect(() => {
    api
      .getAllCafes()
      .then(data => {
        const forHangout = data.filter(
          cafe =>
            cafe.limited_time === 'no' && cafe.music === 5 && cafe.seat === 5
        )

        const forWork = data.filter(
          cafe =>
            cafe.limited_time === 'no' &&
            cafe.socket === 'yes' &&
            cafe.quiet === 5 &&
            cafe.wifi === 5
        )

        setCafesForHangout(forHangout)
        setCafesForWork(forWork)
      })
      .catch(error => {
        onAlertOpen()
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }, [type])

  const filterBoxShadow = useColorModeValue(
    'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
    'rgba(204,204,204,0.6) 1.95px 1.95px 2.6px'
  )

  return (
    <Flex
      w="full"
      maxW="1170px"
      h="100%"
      direction="column"
      align="center"
      ref={scrollToTopRef}
    >
      <Heading as="h1" fontSize={{ base: '28px', md: '40px' }}>
        {collectionType === 'work' ? '不受打擾' : '盡情暢聊'}
      </Heading>
      <Text my="3" fontSize={{ base: '18px', md: '20px' }} textAlign="center">
        {collectionType === 'work'
          ? '精選適合工作咖啡廳'
          : '精選適合聚會咖啡廳'}
      </Text>
      <Wrap spacing="15px" justify="center" mb="4">
        {collectionType === 'work'
          ? workLabels.map((label, i) => (
              <WrapItem key={i}>
                <Tag
                  size="lg"
                  color="primaryDark"
                  bg="gray.200"
                  boxShadow={filterBoxShadow}
                >
                  <TagLeftIcon boxSize="12px" as={CheckIcon} />
                  <TagLabel>{label}</TagLabel>
                </Tag>
              </WrapItem>
            ))
          : hangoutLabels.map((label, i) => (
              <WrapItem key={i}>
                <Tag
                  size="lg"
                  color="primaryDark"
                  bg="gray.200"
                  boxShadow={filterBoxShadow}
                >
                  <TagLeftIcon boxSize="12px" as={CheckIcon} />
                  <TagLabel>{label}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
      </Wrap>

      {isLoading ? (
        <CustomSpinner />
      ) : (
        <>
          <VStack alignSelf="flex-end" mb="4">
            <Text mt="3" alignSelf="flex-end">
              {districtFilteredCafes.length > 0
                ? districtFilteredCafes.length
                : collectionType === 'work'
                ? cafesForWork.length
                : cafesForHangout.length}{' '}
              間符合
            </Text>
            <PopoverCityFilter
              filteredCafes={
                collectionType === 'work' ? cafesForWork : cafesForHangout
              }
              setDistrictFilteredCafes={setDistrictFilteredCafes}
              filterCityValue={filterCityValue}
              getCityRadioProps={getCityRadioProps}
              filterDistrictValue={filterDistrictValue}
              getDistrictCheckboxProps={getDistrictCheckboxProps}
              getRootProps={getRootProps}
              setCurrentPage={setCurrentPage}
            />
          </VStack>

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
          <CustomPagination
            total={
              districtFilteredCafes.length > 0
                ? districtFilteredCafes.length
                : collectionType === 'work'
                ? cafesForWork.length
                : cafesForHangout.length
            }
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            cardsPerPage={cafesPerPage}
            scrollToTopRef={scrollToTopRef}
          />
        </>
      )}
      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader="Oops! 暫無法取得咖啡廳資料"
        alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com "
      />
    </Flex>
  )
}

export default Collections
