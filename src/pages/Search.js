import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Flex,
  Heading,
  Text,
  Spinner,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
} from '@chakra-ui/react'
import { BiSearchAlt } from 'react-icons/bi'
import CafeCard from '../components/cafe/CafeCard'
import nomad from '../utils/nomadApi'

function Search() {
  const [matchedCafes, setMatchedCafes] = useState([])
  const [reSearchKeywords, setReSearchKeywords] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  let { keywords } = useParams()
  const navigate = useNavigate()

  const getSearchResults = searchWords => {
    nomad
      .getAllCafes()
      .then(data => {
        const matched = data.filter(cafe =>
          cafe.name.toLowerCase().includes(searchWords)
        )
        console.log(matched)
        setMatchedCafes(matched)
      })
      .catch(() => alert('搜尋出現問題，請重新嘗試，或通知開發人員'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    getSearchResults(keywords)
  }, [keywords])

  const submitSearch = () => {
    setIsLoading(true)
    navigate(`/search/${reSearchKeywords}`)
    setReSearchKeywords('')
  }

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
          <Flex as="section" my="20" direction="column" alignItems="center">
            <Text as="h2" size="lg" mb="3">
              重新搜尋
            </Text>
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <BiSearchAlt />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                value={reSearchKeywords}
                onChange={e => setReSearchKeywords(e.target.value)}
              />
            </InputGroup>
            <Button onClick={submitSearch}>搜尋</Button>
          </Flex>
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
