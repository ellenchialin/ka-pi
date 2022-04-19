import { useState } from 'react'
// prettier-ignore
import { useCheckbox,chakra,Box,Text,useCheckboxGroup,Heading,Flex,Button,Spinner,Tag,TagLeftIcon,TagLabel } from '@chakra-ui/react'
import { FaHashtag } from 'react-icons/fa'
import CafeCard from '../../components/cafe/CafeCard'
import Pagination from '../../components/Pagination'
import usePageTracking from '../../usePageTracking'

function SearchByFeature() {
  usePageTracking()
  const [filteredCafes, setFilteredCafes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage] = useState(30)
  const [isLoading, setIsLoading] = useState(false)

  const indexOfLastCafe = currentPage * cafesPerPage
  const indexOfFirstCafe = indexOfLastCafe - cafesPerPage
  const currentCafes = filteredCafes.slice(indexOfFirstCafe, indexOfLastCafe)
  const paginate = pageNumber => setCurrentPage(pageNumber)

  const defaultFeatures = ['不限時', '有插座']
  const ratingFeatures = [
    { text: 'WiFi穩定', tag: 'wifi' },
    { text: '通常有位', tag: 'seat' },
    { text: '店內安靜', tag: 'quiet' },
    { text: '咖啡好喝', tag: 'tasty' },
    { text: '價格親民', tag: 'cheap' },
    { text: '裝潢音樂', tag: 'music' },
  ]

  function CustomCheckbox(props) {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
      useCheckbox(props)

    return (
      <chakra.label
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gridColumnGap={2}
        maxW="28"
        bg="transparent"
        border="1px solid"
        borderColor="gray.500"
        rounded="lg"
        px={3}
        py={1}
        cursor="pointer"
        {...htmlProps}
      >
        <input {...getInputProps()} />
        <Flex
          alignItems="center"
          justifyContent="center"
          border="2px solid"
          borderColor="gray.500"
          w={4}
          h={4}
          {...getCheckboxProps()}
        >
          {state.isChecked && <Box w={2} h={2} bg="gray.500" />}
        </Flex>
        <Text fontSize="0.875rem" {...getLabelProps()}>
          {props.text}
        </Text>
      </chakra.label>
    )
  }

  const { value, getCheckboxProps } = useCheckboxGroup()
  console.log(value)

  const submitSearch = () => {
    setIsLoading(true)

    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
      .then(data => {
        const defaultMatched = data.filter(
          cafe => cafe.limited_time === 'no' && cafe.socket === 'yes'
        )

        let results = []
        value.forEach(feature => {
          const cafes = defaultMatched.filter(cafe => cafe[feature] >= 5)
          results.push(cafes)
        })
        setFilteredCafes(results.flat())
        console.log('From SearchFeature Page: ', results.flat())
      })
      .catch(error => {
        alert('篩選發生錯誤，請確認網路連線，或聯繫開發人員')
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Flex as="section" direction="column" alignItems="center">
      <Heading as="h2" size="lg" mb="3">
        透過條件進階搜尋
      </Heading>
      <Flex w="400px" justify="center" align="center" direction="column">
        <Text>預設必備條件</Text>
        <Flex>
          {defaultFeatures.map((feature, i) => (
            <Tag key={i} size="md" colorScheme="messenger">
              <TagLeftIcon boxSize="12px" as={FaHashtag} />
              <TagLabel>{feature}</TagLabel>
            </Tag>
          ))}
        </Flex>
      </Flex>
      <Flex
        direction="column"
        align="center"
        bg="gray.200"
        px="4"
        py="6"
        mb="12"
        borderRadius="xl"
      >
        <Flex wrap="wrap" justify="space-evenly">
          {ratingFeatures.map(feature => (
            <CustomCheckbox
              key={feature.tag}
              mb="3"
              {...getCheckboxProps({ value: feature.tag, text: feature.text })}
            />
          ))}
        </Flex>
        <Button
          colorScheme="blackAlpha"
          variant="solid"
          fontSize="0.875rem"
          fontWeight="normal"
          px="6"
          h="8"
          onClick={submitSearch}
          isDisabled={value.length === 0 ? true : false}
        >
          進階篩選
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
          <Text my="3">共篩選 {filteredCafes.length} 間咖啡廳</Text>
          <Flex
            w="100%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            as="section"
          >
            {currentCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </Flex>
          <Pagination
            cafesPerPage={cafesPerPage}
            totalCafes={filteredCafes.length}
            paginate={paginate}
          />
        </Flex>
      )}
    </Flex>
  )
}

export default SearchByFeature
