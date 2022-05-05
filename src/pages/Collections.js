import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Text, Spinner, Tag, TagLeftIcon, TagLabel, SimpleGrid, Wrap, WrapItem, VStack } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import PopoverCityFilter from '../components/PopoverCityFilter'
import Pagination from '@choc-ui/paginator'
import useUpdateEffect from '../hooks/useUpdateEffect'
import usePageTracking from '../usePageTracking'
import CafeCard from '../components/cafe/CafeCard'

function Collections() {
  usePageTracking()
  const { type } = useParams()
  const [collectionType, setCollectionType] = useState(type)
  const [cafesForWork, setCafesForWork] = useState([])
  const [cafesForHangout, setCafesForHangout] = useState([])
  const [advacedFilteredCafes, setAdvacedFilteredCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(20)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes =
    advacedFilteredCafes.length > 0
      ? advacedFilteredCafes.slice(offset, offset + cafesPerPage)
      : collectionType === 'work'
      ? cafesForWork.slice(offset, offset + cafesPerPage)
      : cafesForHangout.slice(offset, offset + cafesPerPage)

  const workLabels = ['不限時', '夠安靜', '有插座', 'WiFi穩定']
  const hangoutLabels = ['不限時', '裝潢音樂', '通常有位']

  useEffect(() => {
    setCollectionType(type)
  }, [type])

  useEffect(() => {
    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
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
        alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const updateCityFilter = () => {
    if (collectionType === 'work') {
      setCafesForWork(advacedFilteredCafes)
    } else {
      setCafesForHangout(advacedFilteredCafes)
    }
  }

  // useUpdateEffect(updateCityFilter, advacedFilteredCafes)

  return (
    <Flex w="full" maxW="1170px" direction="column" align="center">
      <Heading as="h1" fontSize={{ base: '28px', md: '40px' }}>
        {collectionType === 'work' ? '不受打擾' : '盡情暢聊'}
      </Heading>
      <Text my="3" fontSize={{ base: '18px', md: '24px' }} textAlign="center">
        {collectionType === 'work'
          ? '精選全台最適合工作咖啡廳'
          : '精選適合聚會咖啡廳'}
      </Text>
      <Wrap spacing="15px" justify="center" mb="4">
        {collectionType === 'work'
          ? workLabels.map((label, i) => (
              <WrapItem key={i}>
                <Tag size="lg" color="primaryDark" bg="gray.200">
                  <TagLeftIcon boxSize="12px" as={CheckIcon} />
                  <TagLabel>{label}</TagLabel>
                </Tag>
              </WrapItem>
            ))
          : hangoutLabels.map((label, i) => (
              <WrapItem key={i}>
                <Tag size="lg" color="primaryDark" bg="gray.200">
                  <TagLeftIcon boxSize="12px" as={CheckIcon} />
                  <TagLabel>{label}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
      </Wrap>

      {isLoading ? (
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal"
          size="lg"
          mt="6"
        />
      ) : (
        <>
          <VStack alignSelf="flex-end" mb="4">
            <Text mt="3" alignSelf="flex-end">
              共有{' '}
              {advacedFilteredCafes.length > 0
                ? advacedFilteredCafes.length
                : collectionType === 'work'
                ? cafesForWork.length
                : cafesForHangout.length}{' '}
              間符合
            </Text>
            <PopoverCityFilter
              filteredCafes={
                collectionType === 'work' ? cafesForWork : cafesForHangout
              }
              setAdvacedFilteredCafes={setAdvacedFilteredCafes}
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
          <Pagination
            defaultCurrent={1}
            total={
              advacedFilteredCafes.length > 0
                ? advacedFilteredCafes.length
                : collectionType === 'work'
                ? cafesForWork.length
                : cafesForHangout.length
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
        </>
      )}
    </Flex>
  )
}

export default Collections
