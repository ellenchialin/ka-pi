import { useSearchParams } from 'react-router-dom'
// prettier-ignore
import { Heading, Icon, Text, VStack, HStack, useColorModeValue } from '@chakra-ui/react'
import { HiOutlineArrowCircleRight } from 'react-icons/hi'
import PropTypes from 'prop-types'

function CityInfoCard({
  clickedCity,
  cityChineseName,
  cityCafes,
  taipeiCafes,
  newTaipeiCafes,
  isLoading,
}) {
  const [, setSearchParams] = useSearchParams()

  const getCafeNumbers = () => {
    if (taipeiCafes.length > 0) {
      return `共收錄 ${taipeiCafes.length} 間咖啡廳`
    }
    if (newTaipeiCafes.length > 0) {
      return `共收錄 ${newTaipeiCafes.length} 間咖啡廳`
    }
    return `共收錄 ${cityCafes.length} 間咖啡廳`
  }

  const handleShowCityList = () => setSearchParams({ city: clickedCity })

  return (
    <VStack spacing="2" bg={useColorModeValue('primaryDark', 'primaryLight')}>
      <Heading
        as="h4"
        size="md"
        color={useColorModeValue('primaryLight', 'primaryDark')}
      >
        {cityChineseName}
      </Heading>
      <Text color={useColorModeValue('primaryLight', 'primaryDark')}>
        {isLoading ? '整理咖啡廳中...' : getCafeNumbers()}
      </Text>
      <HStack spacing="1" align="center">
        <Icon
          as={HiOutlineArrowCircleRight}
          color={useColorModeValue('accent', 'primaryDark')}
        />
        <Text
          onClick={handleShowCityList}
          color={useColorModeValue('accent', 'primaryDark')}
          cursor="pointer"
        >
          看完整名單
        </Text>
      </HStack>
    </VStack>
  )
}

CityInfoCard.propTypes = {
  clickedCity: PropTypes.string.isRequired,
  cityChineseName: PropTypes.string.isRequired,
  cityCafes: PropTypes.array.isRequired,
  taipeiCafes: PropTypes.array.isRequired,
  newTaipeiCafes: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default CityInfoCard
