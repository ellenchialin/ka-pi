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
import nomad from '../../utils/nomadApi'

function ForHangout() {
  const [cafesForHangout, setCafesForHangout] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const labels = ['不限時', '背景音樂', '通常有位']

  useEffect(() => {
    nomad
      .getAllCafes()
      .then(data => {
        const filteredCafes = data.filter(
          cafe =>
            cafe.limited_time === 'no' && cafe.music === 5 && cafe.seat === 5
        )

        setCafesForHangout(filteredCafes)
        console.log(filteredCafes)
      })
      .catch(error => {
        console.error(error)
        alert('暫無法取得咖啡廳資料，請通知開發人員')
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Flex as="section" direction="column" align="center">
      <Heading as="h1" size="xl">
        盡情暢聊
      </Heading>
      <Text my="3">精選適合聚會咖啡廳</Text>
      <Flex w="300px" justify="space-between" align="center">
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
          <Text my="3">共有 {cafesForHangout.length} 間符合</Text>

          <Flex
            w="100%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            as="section"
          >
            {cafesForHangout.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default ForHangout
