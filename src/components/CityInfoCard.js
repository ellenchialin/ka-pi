import { Link } from 'react-router-dom'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { HiOutlineArrowCircleRight } from 'react-icons/hi'

function CityInfoCard({
  hoveredCity,
  cityLinkEndpoint,
  isLoading,
  cityCafes,
  taipeiCafes,
  newTaipeiCafes,
}) {
  const getCafeNumbers = () => {
    if (taipeiCafes.length > 0) {
      console.log('Taipei Cafes: ', taipeiCafes)
      return `共收錄 ${taipeiCafes.length} 間咖啡廳`
    } else if (newTaipeiCafes.length > 0) {
      console.log('New Taipei Cafes: ', newTaipeiCafes)
      return `共收錄 ${newTaipeiCafes.length} 間咖啡廳`
    } else {
      return `共收錄 ${cityCafes.length} 間咖啡廳`
    }
  }

  return (
    <>
      <Heading as="h4" size="md" color="white">
        {hoveredCity}
      </Heading>
      <Text color="white" fontSize="0.875rem">
        {isLoading ? '整理咖啡廳中...' : getCafeNumbers()}
      </Text>
      <Flex align="center" mt="2">
        <HiOutlineArrowCircleRight color="#ecc94b" />
        <Link
          to={`/city/${cityLinkEndpoint}`}
          style={{ color: '#ecc94b', fontSize: '0.875rem' }}
        >
          前往看完整名單
        </Link>
      </Flex>
    </>
  )
}

export default CityInfoCard
