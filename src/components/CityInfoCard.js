import { useContext } from 'react'
import CityContext from '../contexts/CityContext'
import { Flex, Heading, Text, Link } from '@chakra-ui/react'
import { HiOutlineArrowCircleRight } from 'react-icons/hi'

function CityInfoCard({ hoveredCity, isLoading, cityCafes }) {
  // const { cityLinkEndpoint, setCityLinkEndpoint } = useContext(CityContext)

  return (
    <>
      <Heading as="h4" size="md" color="white">
        {hoveredCity}
      </Heading>
      <Text color="white" fontSize="0.875rem">
        {isLoading ? '計算中...' : `共收錄 ${cityCafes.length} 間咖啡廳`}
      </Text>
      <Flex align="center" mt="2">
        <HiOutlineArrowCircleRight color="#ecc94b" />
        <Link href={`/city`} color="#ecc94b" fontSize="0.875rem" ml="2">
          前往看完整名單
        </Link>
      </Flex>
    </>
  )
}

export default CityInfoCard
