import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Heading, Text, Spinner, Tag, TagLeftIcon, TagLabel } from '@chakra-ui/react'
import { FaHashtag } from 'react-icons/fa'
import CafeCard from '../../components/cafe/CafeCard'
import Pagination from '../../components/Pagination'
import usePageTracking from '../../usePageTracking'

function ForWork() {
  usePageTracking()
  const [cafesForWork, setCafesForWork] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(20)
  const [isLoading, setIsLoading] = useState(true)

  const labels = ['不限時', '夠安靜', '有插座', 'WiFi穩定']

  const indexOfLastCafe = currentPage * cafesPerPage
  const indexOfFirstCafe = indexOfLastCafe - cafesPerPage
  const currentCafes = cafesForWork.slice(indexOfFirstCafe, indexOfLastCafe)
  const paginate = pageNumber => setCurrentPage(pageNumber)

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
    <Flex as="section" direction="column" align="center">
      <Heading as="h1" size="xl">
        不受打擾
      </Heading>
      <Text my="3">精選全台最適合工作咖啡廳</Text>
      <Flex w="400px" justify="space-between" align="center">
        {labels.map((label, i) => (
          <Tag key={i} size="md" colorScheme="messenger">
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
            totalCafes={cafesForWork.length}
            paginate={paginate}
          />
        </>
      )}
    </Flex>
  )
}

export default ForWork
