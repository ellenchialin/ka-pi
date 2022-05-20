import PropTypes from 'prop-types'
// prettier-ignore
import { Flex, Heading, Text, Icon, IconButton, Link, HStack } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import { AiOutlineGlobal } from 'react-icons/ai'
import { RiDirectionFill } from 'react-icons/ri'
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs'

function CafeHeader({ cafe, cafeCoverUrl, toggleSaved, handleToggleSaved }) {
  return (
    <Flex
      w="100%"
      h="100%"
      py="4"
      px="2"
      mb="4"
      minH="300px"
      bgImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${cafeCoverUrl()})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      borderRadius="xl"
      direction="column"
      align="center"
      justify="center"
      position="relative"
    >
      <HStack spacing="5px">
        <Text color="primaryLight">{cafe.tasty}</Text>
        <StarIcon w="3" h="3" color="primaryLight" />
      </HStack>
      <Heading
        as="h1"
        fontSize={{ base: '28px', md: '40px' }}
        letterSpacing="widest"
        align="center"
        pt="2"
        pb="4"
        color="primaryLight"
      >
        {cafe.name}
      </Heading>

      <HStack spacing="20px">
        <HStack align="center" spacing="10px">
          <Icon as={RiDirectionFill} color="white" />
          <Link
            href={`https://www.google.com/maps/place/${cafe.latitude},${cafe.longitude}/@${cafe.latitude},${cafe.longitude},16z`}
            fontSize="0.875rem"
            color="primaryLight"
            isExternal
          >
            Direction
          </Link>
        </HStack>
        <HStack align="center" spacing="10px">
          <Icon as={AiOutlineGlobal} color="white" />
          <Link
            href={`${cafe.url}`}
            fontSize="0.875rem"
            color="primaryLight"
            isExternal
          >
            Website
          </Link>
        </HStack>
      </HStack>
      <IconButton
        position="absolute"
        top="-20px"
        right="20px"
        colorScheme="teal"
        isRound={true}
        aria-label="收藏到我的咖啡廳地圖"
        icon={
          toggleSaved ? (
            <BsFillBookmarkFill size="22px" />
          ) : (
            <BsBookmark size="22px" />
          )
        }
        onClick={handleToggleSaved}
      ></IconButton>
    </Flex>
  )
}

CafeHeader.propTypes = {
  cafe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tasty: PropTypes.number.isRequired,
    latitude: PropTypes.string.isRequired,
    longitude: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  cafeCoverUrl: PropTypes.func.isRequired,
  toggleSaved: PropTypes.bool.isRequired,
  handleToggleSaved: PropTypes.func.isRequired,
}

export default CafeHeader
