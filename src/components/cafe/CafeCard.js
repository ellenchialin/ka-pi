import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// prettier-ignore
import { Flex, Box, AspectRatio, Image, Badge, Heading, Text, IconButton, VStack, useColorModeValue } from '@chakra-ui/react'
import { ArrowRightIcon, StarIcon } from '@chakra-ui/icons'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { firebase } from '../../utils/firebase'
import { thumbnails } from '../../cafeThumbnails'

function CafeCard({ cafe, canDeleteCafe, handleDeleteCafe }) {
  const [coverPhoto, setCoverPhoto] = useState(null)

  useEffect(() => {
    firebase.getAllBlogs(cafe.id).then(blogs => {
      if (blogs.length > 0) {
        setCoverPhoto(blogs[0].image)
      }
    })
  }, [])

  const getRandomCafeThumbnail = () => {
    const randomNum = Math.floor(Math.random() * 16) + 1
    return thumbnails[randomNum]
  }

  const thumbnailUrl = useMemo(() => getRandomCafeThumbnail(), [])

  return (
    <>
      <Box
        w="270px"
        h="100%"
        minH={{ sm: '300px', md: '360px' }}
        bg="white"
        borderWidth={useColorModeValue('1px', '0px')}
        rounded="lg"
        shadow="lg"
        color="primaryDark"
        position="relative"
      >
        <AspectRatio maxW="100%" ratio={{ base: 16 / 9, sm: 4 / 3 }}>
          <Image
            src={coverPhoto ? coverPhoto : ''}
            alt={`${cafe.name} 店內照片`}
            roundedTop="lg"
            objectFit="cover"
            align="center"
            fallbackSrc={thumbnailUrl}
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
            onClick={handleDeleteCafe}
          />
        )}

        <VStack spacing="2" p="4" align="flex-start">
          <Flex w="full" align="center" justify="space-between">
            <Heading
              w="full"
              as="h5"
              pr="1"
              pt="0.5"
              fontSize={{ base: '18px', md: '20px' }}
              isTruncated
            >
              {cafe.name}
            </Heading>
            <Link to={`/cafe/${cafe.id}`}>
              <ArrowRightIcon w="3" h="3" _hover={{ color: 'thirdDark' }} />
            </Link>
          </Flex>
          <Text w="full" fontSize={{ base: '14px', md: '16px' }} isTruncated>
            {cafe.address}
          </Text>
          <Flex align="center">
            <Text fontSize={{ base: '14px', md: '16px' }} mr="1">
              {cafe.tasty}
            </Text>
            <StarIcon w="3" h="3" />
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

CafeCard.propTypes = {
  cafe: PropTypes.object,
  canDeleteCafe: PropTypes.bool,
  handleDeleteCafe: PropTypes.func,
}

export default CafeCard
