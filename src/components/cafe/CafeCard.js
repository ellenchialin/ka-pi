import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// prettier-ignore
import { Flex, Box, AspectRatio, Image, Badge, Heading, Text, IconButton, VStack, useColorModeValue } from '@chakra-ui/react'
import { ArrowRightIcon } from '@chakra-ui/icons'
import { GiRoundStar } from 'react-icons/gi'
import { AiOutlineDoubleRight } from 'react-icons/ai'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { firebase } from '../../utils/firebase'

function CafeCard({ cafe, canDeleteCafe, handleDelete }) {
  const [coverPhoto, setCoverPhoto] = useState(null)

  useEffect(() => {
    firebase.getAllBlogs(cafe.id).then(blogs => {
      if (blogs.length > 0) {
        setCoverPhoto(blogs[0].image)
      }
    })
  }, [])

  return (
    <>
      <Box
        w="100%"
        h="100%"
        minH={{ sm: '300px', md: '360px' }}
        bg="white"
        borderWidth={useColorModeValue('1px', '0px')}
        rounded="lg"
        shadow="lg"
        color="primaryDark"
        position="relative"
      >
        <AspectRatio maxW="100%" ratio={{ base: 16 / 9, sm: 4 / 3, md: 1 }}>
          <Image
            src={coverPhoto ? coverPhoto : ''}
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

        <VStack spacing="2" p="4" align="flex-start">
          <Flex w="full" align="center" justify="space-between">
            <Heading w="full" as="h5" size="sm" isTruncated>
              {cafe.name}
            </Heading>
            <Link to={`/cafe/${cafe.id}`}>
              <ArrowRightIcon w="3" h="3" />
            </Link>
          </Flex>
          <Text w="full" fontSize="0.75em" isTruncated>
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
                bg="red.100"
                color="red.800"
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
                bg="green.100"
                color="green.800"
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
                bg="facebook.100"
                color="facebook.800"
              >
                WiFi 穩定
              </Badge>
            )}
          </Box>
        </VStack>
      </Box>
    </>
  )
}

export default CafeCard
