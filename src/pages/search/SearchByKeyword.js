import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import CafeCard from '../../components/cafe/CafeCard'
import nomad from '../../utils/nomadApi'

function SearchByKeyword() {
  const [matchedCafes, setMatchedCafes] = useState([])
  const [searchKeywords, setSearchKeywords] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const getSearchResults = searchWords => {
    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
      .then(data => {
        const matched = data.filter(cafe =>
          cafe.name.toLowerCase().includes(searchWords)
        )
        setMatchedCafes(matched)
        setSearchParams(searchWords)
        console.log('From SearchKeywords Page: ', matched)
      })
      .catch(error => {
        alert('搜尋發生錯誤，請確認網路連線，或聯繫開發人員')
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  // 用 custom hook 避免第一次 render 就打 api

  const submitSearch = () => {
    if (searchKeywords === '') alert('')

    setIsLoading(true)
    getSearchResults(searchKeywords)
  }

  return (
    <>
      <Flex as="section" direction="column" alignItems="center">
        <Heading as="h2" size="lg" mb="3">
          透過關鍵字搜尋
        </Heading>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <BiSearchAlt />
          </InputLeftElement>
          <Input
            placeholder="Search..."
            value={searchKeywords}
            onChange={e => setSearchKeywords(e.target.value.trim())}
          />
        </InputGroup>
        <Button
          onClick={submitSearch}
          isDisabled={searchKeywords === '' ? true : false}
        >
          搜尋
        </Button>
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
        <Flex direction="column" align="center">
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
        </Flex>
      )}
    </>
  )
}

export default SearchByKeyword
