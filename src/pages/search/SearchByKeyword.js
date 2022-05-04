import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, InputGroup, InputRightElement, IconButton, FormControl } from '@chakra-ui/react'
// prettier-ignore
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete'
import { BiSearchAlt } from 'react-icons/bi'
import { api } from '../../utils/api'
import CafeCard from '../../components/cafe/CafeCard'
import usePageTracking from '../../usePageTracking'

function SearchByKeyword() {
  usePageTracking()
  const [allCafes, setAllCafes] = useState([])
  const [matchedCafe, setMatchedCafe] = useState(null)
  const [searchCafe, setSearchCafe] = useState(null)

  // const [searchParams, setSearchParams] = useSearchParams()

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
    const matched = allCafes.find(cafe => cafe.name === searchCafe)

    setMatchedCafe(matched)
    // setSearchParams(searchCafe)
  }

  return (
    <Flex w="100%" direction="column" align="center">
      <Heading as="h1" size="xl" mb="6">
        關鍵字搜尋
      </Heading>

      <FormControl
        maxW="400px"
        display="flex"
        align="center"
        justify="center"
        mb="10"
      >
        <AutoComplete w="100%" onChange={cafe => setSearchCafe(cafe)}>
          <InputGroup>
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
              autoFocus
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
      </FormControl>

      {matchedCafe && <CafeCard cafe={matchedCafe} />}
    </Flex>
  )
}

export default SearchByKeyword
