import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Heading, Text, Spinner, Tag, TagLeftIcon, TagLabel, SimpleGrid, HStack } from '@chakra-ui/react'
import { FaHashtag } from 'react-icons/fa'
import Pagination from '@choc-ui/paginator'
import CafeCard from '../../components/cafe/CafeCard'
import usePageTracking from '../../usePageTracking'

function ForWork() {
  usePageTracking()
  const [cafesForWork, setCafesForWork] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(10)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes = cafesForWork.slice(offset, offset + cafesPerPage)

  const labels = ['不限時', '夠安靜', '有插座', 'WiFi穩定']

  useEffect(() => {
    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
      .then(data => {
        const filteredCafes = data.filter(
          cafe =>
            cafe.limited_time === 'no' &&
            cafe.socket === 'yes' &&
            cafe.quiet === 5 &&
            cafe.wifi === 5
        )

        setCafesForWork(filteredCafes)
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
        不受打擾
      </Heading>
      <Text my="3">精選全台最適合工作咖啡廳</Text>
      <Flex
        w="full"
        maxW="400px"
        justify="space-evenly"
        align="center"
        wrap="wrap"
        mb="4"
      >
        {labels.map((label, i) => (
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
          <Text my="3">共有 {cafesForWork.length} 間符合</Text>

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
            total={cafesForWork.length}
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

export default ForWork
