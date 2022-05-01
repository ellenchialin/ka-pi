import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Text, Spinner, Tag, TagLeftIcon, TagLabel, SimpleGrid } from '@chakra-ui/react'
import { FaHashtag } from 'react-icons/fa'
import Pagination from '@choc-ui/paginator'
import usePageTracking from '../usePageTracking'
import CafeCard from '../components/cafe/CafeCard'

function Collections() {
  usePageTracking()
  const { type } = useParams()
  const [collectionType, setCollectionType] = useState(type)
  const [cafesForWork, setCafesForWork] = useState([])
  const [cafesForHangout, setCafesForHangout] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(10)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes =
    collectionType === 'work'
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

  return (
    <Flex w="full" direction="column" align="center">
      <Heading as="h1" size="xl">
        {collectionType === 'work' ? '不受打擾' : '盡情暢聊'}
      </Heading>
      <Text my="3">
        {collectionType === 'work'
          ? '精選全台最適合工作咖啡廳'
          : '精選適合聚會咖啡廳'}
      </Text>
      <Flex
        w="full"
        maxW="400px"
        justify="space-evenly"
        align="center"
        wrap="wrap"
        mb="4"
      >
        {collectionType === 'work'
          ? workLabels.map((label, i) => (
              <Tag key={i} size="md" colorScheme="teal" mb="2">
                <TagLeftIcon boxSize="12px" as={FaHashtag} />
                <TagLabel>{label}</TagLabel>
              </Tag>
            ))
          : hangoutLabels.map((label, i) => (
              <Tag key={i} size="md" colorScheme="teal" mb="2">
                <TagLeftIcon boxSize="12px" as={FaHashtag} />
                <TagLabel>{label}</TagLabel>
              </Tag>
            ))}
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
        <>
          <Text my="3">
            共有{' '}
            {collectionType === 'work'
              ? cafesForWork.length
              : cafesForHangout.length}{' '}
            間符合
          </Text>

          <SimpleGrid
            w="full"
            columns={[1, 2, 2, 3]}
            spacing={['15px', '15px', '20px']}
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
              collectionType === 'work'
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
