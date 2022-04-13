import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react'
import CafeCard from '../components/cafe/CafeCard'
import nomad from '../utils/nomadApi'

function Search() {
  const [matchedCafes, setMatchedCafes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  let { keywords } = useParams()

  useEffect(() => {
    nomad
      .getAllCafes()
      .then(data => {
        const matched = data.filter(cafe =>
          cafe.name.toLowerCase().includes(keywords)
        )
        console.log(matched)
        setMatchedCafes(matched)
      })
      .catch(() => alert('搜尋出現問題，請重新嘗試，或通知開發人員'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Flex as="section" direction="column" align="center">
      <Heading as="h1" size="xl">
        搜尋關鍵字：{keywords}
      </Heading>
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
          <Text my="3">共找到 {matchedCafes.length} 間關聯咖啡廳</Text>
          <Flex
            w="100%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            as="section"
          >
            {matchedCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default Search
