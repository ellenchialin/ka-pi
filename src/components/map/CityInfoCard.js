import { Link as RouterLink } from 'react-router-dom'
// prettier-ignore
import { Heading, Icon, Text, Link, VStack, HStack, useColorModeValue } from '@chakra-ui/react'
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
      return `共收錄 ${taipeiCafes.length} 間咖啡廳`
    } else if (newTaipeiCafes.length > 0) {
      return `共收錄 ${newTaipeiCafes.length} 間咖啡廳`
    } else {
      return `共收錄 ${cityCafes.length} 間咖啡廳`
    }
  }

  return (
    <VStack spacing="2">
      <Heading
        as="h4"
        size="md"
        color={useColorModeValue('primaryLight', 'primaryDark')}
      >
        {hoveredCity}
      </Heading>
      <Text
        fontSize="0.875rem"
        color={useColorModeValue('primaryLight', 'primaryDark')}
      >
        {isLoading ? '整理咖啡廳中...' : getCafeNumbers()}
      </Text>
      <HStack spacing="1" align="center">
        <Icon
          as={HiOutlineArrowCircleRight}
          color={useColorModeValue('accent', 'primaryDark')}
        />
        <Link
          as={RouterLink}
          to={`/city/${cityLinkEndpoint}`}
          color={useColorModeValue('accent', 'primaryDark')}
          fontSize="0.875rem"
          isExternal
        >
          前往看完整名單
        </Link>
      </HStack>
    </VStack>
  )
}

export default CityInfoCard