import { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  Text,
  Spinner,
  Tag,
  TagLeftIcon,
  TagLabel,
} from '@chakra-ui/react'
import { FaHashtag } from 'react-icons/fa'
import CafeCard from '../../components/cafe/CafeCard'
// import nomad from '../../utils/nomadApi'

function ForWork() {
  const [cafesForWork, setCafesForWork] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
        console.log('From Work Page: ', filteredCafes)
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
            {cafesForWork.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default ForWork
