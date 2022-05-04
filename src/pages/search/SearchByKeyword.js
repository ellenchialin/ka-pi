import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Text, Spinner, InputGroup, InputLeftElement, InputRightElement, Input, Button, SimpleGrid, Wrap, WrapItem, VStack, Stack, IconButton } from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete'
import { BiSearchAlt } from 'react-icons/bi'
import { api } from '../../utils/api'
import CafeCard from '../../components/cafe/CafeCard'
import usePageTracking from '../../usePageTracking'

function SearchByKeyword() {
  usePageTracking()
  const [allCafes, setAllCafes] = useState([])
  const [matchedCafe, setMatchedCafe] = useState(null)
  const [searchCafe, setSearchCafe] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    api
      .getAllCafes()
      .then(data => {
        setAllCafes(data)
      })
      .catch(error => {
        alert('搜尋發生錯誤，請確認網路連線，或聯繫開發人員')
        console.error(error)
      })
  }, [])

  const submitSearch = () => {
    console.log('Click search')
    const matched = allCafes.find(cafe => cafe.name === searchCafe)

    setMatchedCafe(matched)
    setSearchParams(searchCafe)
  }

  return (
    <VStack w="full" align="center">
      <Heading as="h1" size="xl" mb="4">
        關鍵字搜尋
      </Heading>

      <AutoComplete w="100%" bg="blue" onChange={cafe => setSearchCafe(cafe)}>
        <InputGroup mb="10" maxW="500px" alignSelf="center">
          <InputRightElement>
            <IconButton
              icon={<BiSearchAlt />}
              fontSize="20px"
              aria-label="搜尋"
              onClick={submitSearch}
              isDisabled={!searchCafe ? true : false}
            />
          </InputRightElement>
          <AutoCompleteInput
            variant="filled"
            placeholder="Search..."
            alignSelf="center"
          />
        </InputGroup>
        <AutoCompleteList>
          {allCafes.map((cafe, i) => (
            <AutoCompleteItem
              key={`option-${i}`}
              value={cafe.name}
              textTransform="capitalize"
            >
              {cafe.name}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      {matchedCafe && <CafeCard cafe={matchedCafe} />}
    </VStack>
  )
}

export default SearchByKeyword
