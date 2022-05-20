import { useState, useEffect } from 'react'
// prettier-ignore
import { Flex, Heading, InputGroup, InputRightElement, IconButton, FormControl, Text, useDisclosure } from '@chakra-ui/react'
// prettier-ignore
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete'
import { BiSearchAlt } from 'react-icons/bi'

import { api } from '../../utils/api'
import CafeCard from '../../components/cafe/CafeCard'
import AlertModal from '../../components/shared/AlertModal'
import usePageTracking from '../../usePageTracking'

function SearchByKeyword() {
  usePageTracking()
  const [allCafes, setAllCafes] = useState([])
  const [matchedCafe, setMatchedCafe] = useState(null)
  const [searchCafe, setSearchCafe] = useState(null)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  useEffect(() => {
    api
      .getAllCafes()
      .then(data => setAllCafes(data))
      .catch(error => {
        onAlertOpen()
        console.error(error)
      })
  }, [])

  const submitSearch = () => {
    const matched = allCafes.find(cafe => cafe.name === searchCafe)
    setMatchedCafe(matched)
  }

  return (
    <Flex w="100%" h="100%" direction="column" align="center">
      <Heading as="h1" fontSize={{ base: '28px', md: '40px' }}>
        關鍵字搜尋
      </Heading>
      <Text my="3" fontSize={{ base: '18px', md: '20px' }} textAlign="center">
        輸入咖啡廳名稱進行搜尋
      </Text>

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
              onKeyDown={e => {
                if (e.key === 'Enter') submitSearch()
              }}
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

      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader="Oops! 暫無法取得資料"
        alertBody="請確認網路連線並重新操作，多次失敗請聯繫開發人員 chialin76@gmail.com "
      />
    </Flex>
  )
}

export default SearchByKeyword
