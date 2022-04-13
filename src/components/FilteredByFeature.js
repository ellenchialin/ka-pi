import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  useCheckbox,
  chakra,
  Box,
  Text,
  useCheckboxGroup,
  Flex,
  Button,
} from '@chakra-ui/react'

function FilteredByFeature() {
  // const [selectedFeatures, setSelectedFeatures] = useState([])
  const [searchParams, setSearchParams] = useSearchParams({})
  const navigate = useNavigate()

  const features = [
    { text: '不限時', tag: 'limited_time' },
    { text: '有站立座位', tag: 'standing_desk' },
    { text: 'WiFi穩定', tag: 'wifi' },
    { text: '通常有位子', tag: 'seat' },
    { text: '安靜', tag: 'quiet' },
    { text: '咖啡優', tag: 'tasty' },
    { text: '價格親民', tag: 'cheap' },
    { text: '背景音樂', tag: 'music' },
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
    navigate('/search', { state: { features: value } })
  }

  return (
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
        {features.map(feature => (
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
      >
        搜尋
      </Button>
    </Flex>
  )
}
export default FilteredByFeature
