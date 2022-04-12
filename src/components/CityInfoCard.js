import { Link } from 'react-router-dom'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { HiOutlineArrowCircleRight } from 'react-icons/hi'

function CityInfoCard({ hoveredCity, cityLinkEndpoint, isLoading, cityCafes }) {
  return (
    <>
      <Heading as="h4" size="md" color="white">
        {hoveredCity}
      </Heading>
      <Text color="white" fontSize="0.875rem">
        {isLoading ? '整理咖啡廳中...' : `共收錄 ${cityCafes.length} 間咖啡廳`}
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
