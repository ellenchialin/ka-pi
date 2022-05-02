import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Text, Spinner, InputGroup, InputLeftElement, Input, Button, SimpleGrid } from '@chakra-ui/react'
import { BiSearchAlt } from 'react-icons/bi'
import CafeCard from '../../components/cafe/CafeCard'
import Pagination from '@choc-ui/paginator'
import usePageTracking from '../../usePageTracking'

function SearchByKeyword() {
  usePageTracking()
  const [matchedCafes, setMatchedCafes] = useState([])
  const [searchKeywords, setSearchKeywords] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(20)
  const offset = (currentPage - 1) * cafesPerPage
  const currentCafes = matchedCafes.slice(offset, offset + cafesPerPage)

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
      })
      .catch(error => {
        alert('搜尋發生錯誤，請確認網路連線，或聯繫開發人員')
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  const submitSearch = () => {
    setIsLoading(true)
    getSearchResults(searchKeywords)
  }

  return (
    <>
      <Flex as="section" direction="column" alignItems="center">
        <Heading as="h1" size="xl" mb="3">
          關鍵字搜尋
        </Heading>
        <InputGroup w="100%" maxW="500px" mb="3" justify="center">
          <InputLeftElement pointerEvents="none">
            <BiSearchAlt />
          </InputLeftElement>
          <Input
            htmlSize={28}
            width="auto"
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
          color="teal"
          siz="xl"
          mt="6"
        />
      ) : (
        <Flex direction="column" align="center">
          {matchedCafes.length > 0 && (
            <Text my="3" alignSelf="flex-end">
              共找到 {matchedCafes.length} 間關聯咖啡廳
            </Text>
          )}
          <SimpleGrid
            w="full"
            columns={[1, 2, 2, 3]}
            spacing="20px"
            justifyItems="center"
            mb="4"
          >
            {currentCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </SimpleGrid>
          <Pagination
            defaultCurrent={1}
            total={matchedCafes.length}
            current={currentPage}
            onChange={page => setCurrentPage(page)}
            pageSize={cafesPerPage}
            paginationProps={{ display: 'flex', justifyContent: 'center' }}
            pageNeighbours={2}
            rounded="full"
            baseStyles={{ bg: 'transparent' }}
            activeStyles={{ bg: 'gray.400' }}
            hoverStyles={{ bg: 'gray.400' }}
            responsive={{ activePage: true }}
          />
        </Flex>
      )}
    </>
  )
}

export default SearchByKeyword
