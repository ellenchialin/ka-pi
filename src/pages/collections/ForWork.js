import { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  AspectRatio,
  Image,
} from '@chakra-ui/react'
import CafeCard from '../../components/cafe/CafeCard'

import nomad from '../../utils/nomadApi'

function ForWork() {
  const [cafesForWork, setCafesForWork] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    nomad
      .getAllCafes()
      .then(data => {
        const filteredCafes = data.filter(
          cafe =>
            cafe.limited_time === 'no' &&
            cafe.socket === 'yes' &&
            cafe.quiet === 5 &&
            cafe.wifi === 5
        )

        setCafesForWork(filteredCafes)
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
        不受打擾
      </Heading>
      <Text my="3">精選全台最適合工作咖啡廳</Text>
      {isLoading ? (
        <Text>Loading...</Text>
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
