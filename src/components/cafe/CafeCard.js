import { Link } from 'react-router-dom'
// prettier-ignore
import { Flex, Box, AspectRatio, Image, Badge, Heading, Text, IconButton} from '@chakra-ui/react'
import { GiRoundStar } from 'react-icons/gi'
import { AiOutlineDoubleRight } from 'react-icons/ai'
import { RiDeleteBin5Line } from 'react-icons/ri'

function CafeCard({ cafe, canDeleteCafe, handleDelete }) {
  return (
    <>
      <Box
        w="100%"
        maxW={{ sm: '300px', md: '230px' }}
        h="100%"
        minH={{ sm: '430px', md: '360px' }}
        bg="white"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        mb="6"
        position="relative"
      >
        <AspectRatio maxW="100%" ratio={1}>
          <Image
            src=""
            alt={`${cafe.name} 店內照片`}
            roundedTop="lg"
            objectFit="cover"
            fallbackSrc="https://images.unsplash.com/photo-1534201569625-ed4662d8be97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=411&q=80"
          />
        </AspectRatio>
        {canDeleteCafe && (
          <IconButton
            icon={<RiDeleteBin5Line />}
            aria-label="刪除此蒐藏"
            fontSize="20px"
            position="absolute"
            top="10px"
            right="10px"
            variant="solid"
            colorScheme="blackAlpha"
            size="sm"
            onClick={handleDelete}
          />
        )}

        <Box p="4">
          <Flex alignItems="center" justifyContent="space-between">
            <Heading as="h5" size="sm" isTruncated>
              {cafe.name}
            </Heading>
            <Link to={`/cafe/${cafe.id}`}>
              <AiOutlineDoubleRight size="0.75em" />
            </Link>
          </Flex>
          <Text fontSize="0.75em" isTruncated>
            {cafe.address}
          </Text>
          <Flex alignItems="center">
            <Text fontSize="0.75em" mr="1">
              {cafe.tasty}
            </Text>
            <GiRoundStar size="0.75em" />
          </Flex>

          <Box d="flex" alignItems="center" mt="3">
            {cafe.socket === 'yes' && (
              <Badge
                rounded="full"
                px="2"
                py="1"
                mr="1"
                fontSize="0.75em"
                colorScheme="red"
              >
                有插座
              </Badge>
            )}
            {cafe.limited_time === 'no' && (
              <Badge
                rounded="full"
                px="2"
                py="1"
                mr="1"
                fontSize="0.75em"
                colorScheme="green"
              >
                不限時
              </Badge>
            )}
            {cafe.wifi >= 4 && (
              <Badge
                rounded="full"
                px="2"
                py="1"
                mr="1"
                fontSize="0.75em"
                colorScheme="facebook"
              >
                WiFi 穩定
              </Badge>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default CafeCard
