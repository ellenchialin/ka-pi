import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Flex,
  Heading,
  Box,
  Image,
  Text,
  Spinner,
  Icon,
  IconButton,
  Button,
  Link,
  Divider,
} from '@chakra-ui/react'
import { GiRoundStar } from 'react-icons/gi'
import {
  BsBookmark,
  BsFillBookmarkFill,
  BsFillExclamationTriangleFill,
} from 'react-icons/bs'
import { BiAlarmExclamation } from 'react-icons/bi'
import { ImPowerCord } from 'react-icons/im'
import { GiPerson } from 'react-icons/gi'
import { RiDirectionFill, RiGlobalFill, RiReplyAllFill } from 'react-icons/ri'

import nomad from '../utils/nomadApi'

function Cafe() {
  const [cafe, setCafe] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const { cafeId } = useParams()

  useEffect(() => {
    nomad.getAllCafes().then(data => {
      const cafe = data.filter(item => item.id === cafeId)[0]
      setCafe(cafe)
      setIsLoading(false)
      console.log(cafe)
    })
  }, [])

  // Google maps search url
  // https://www.google.com/maps/place/25.01893400,121.46774700/@25.01893400,121.46774700,16z

  const checkLimitedTime = limited => {
    if (limited === 'no') {
      return '不限時'
    } else if (limited === 'maybe') {
      return '視平假日狀況'
    } else {
      return '有限時'
    }
  }

  const checkSocket = socket => {
    if (socket === 'no') {
      return '很多'
    } else if (socket === 'maybe') {
      return '還好'
    } else {
      return '很少'
    }
  }

  const checkStandSeat = standing => {
    if (standing === 'no') {
      return '沒有'
    } else if (standing === 'yes') {
      return '部分'
    }
  }

  const SecondaryFeatureStat = ({ feature1, feature2 }) => {
    return (
      <Flex
        w="250px"
        maxW={{ base: '300px', md: '500px' }}
        h="100%"
        minH="100px"
        align="center"
        justify="center"
        color="gray.700"
        p="2"
        mb="6"
      >
        <Flex w="100%" h="50px" justify="space-evenly">
          <Flex align="center">
            <Flex direction="column">
              <Text fontSize="0.875rem">{feature1.name}</Text>
              <Heading as="h6" size="sm">
                {feature1.value}
              </Heading>
            </Flex>
          </Flex>

          <Divider size="1em" orientation="vertical" colorScheme="blackAlpha" />

          <Flex align="center">
            <Flex direction="column">
              <Text fontSize="0.875rem">{feature2.name}</Text>
              <Heading as="h6" size="sm">
                {feature2.value}
              </Heading>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  }

  const IGCard = () => {
    return (
      <Box boxSize="250px">
        <Image
          src="https://bit.ly/dan-abramov"
          objectFit="cover"
          alt="網友分享照"
        />
      </Box>
    )
  }

  const Comment = () => {
    return (
      <Flex w="100%" direction="column">
        <Flex w="100%" justify="space-between" align="center">
          <Flex>
            <Image
              borderRadius="full"
              boxSize="150px"
              src="https://bit.ly/dan-abramov"
              alt="Dan Abramov"
            />
            <Text>Dan Abramov</Text>
          </Flex>
          <Icon as={RiReplyAllFill} w={6} h={6} color="gray.800" />
        </Flex>
        <Flex>
          <Text>Must go!</Text>
          <Text>1 天前</Text>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      position="relative"
      w="100%"
      minH="100vh"
    >
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.600"
          siz="xl"
          mt="6"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      ) : (
        <>
          <Flex
            w="100%"
            h="100%"
            py="4"
            px="2"
            mb="4"
            minH={{ sm: '30vh', md: '40vh' }}
            bgImage="linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=878&q=80')"
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            borderRadius="xl"
            d="flex"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Heading
              as="h1"
              size="2xl"
              color="white"
              letterSpacing="widest"
              mb="3"
              align="center"
            >
              {cafe.name}
            </Heading>
            <Flex direction="column">
              <Flex alignItems="center" justify="space-evenly" mb="1">
                <Text fontSize="0.75em" mr="1" color="white">
                  {cafe.tasty}
                </Text>
                <GiRoundStar size="0.75em" color="white" />
              </Flex>
              <Flex>
                <Flex align="center">
                  <Link href={`${cafe.url}`} isExternal>
                    <Icon as={RiDirectionFill} color="white" />
                  </Link>
                </Flex>
                <Flex align="center">
                  <Link href={`${cafe.url}`} isExternal>
                    <Icon as={RiGlobalFill} color="white" />
                  </Link>
                </Flex>
              </Flex>
            </Flex>
            <IconButton
              position="absolute"
              top="-20px"
              right="20px"
              colorScheme="telegram"
              isRound={true}
              aria-label="收藏到我的咖啡廳地圖"
              icon={<BsBookmark size="22px" />}
            ></IconButton>
          </Flex>

          <Flex
            w="100%"
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
          >
            <Flex
              w="100%"
              maxW={{ base: '100%', md: '160px', lg: '220px', xl: '280px' }}
              h="100%"
              minH="100px"
              align="center"
              justify="center"
              bg="gray.700"
              color="white"
              rounded="lg"
              shadow="lg"
              p="2"
              mb="6"
            >
              <Box>
                <Flex direction="column">
                  <Text fontSize="0.875rem">有無限時</Text>
                  <Heading as="h4" fontSize="1.75rem">
                    {checkLimitedTime(cafe.limited_time)}
                  </Heading>
                </Flex>
              </Box>
              <Icon as={BiAlarmExclamation} boxSize="32px" color="yellow.400" />
            </Flex>

            <Flex
              w="100%"
              maxW={{ base: '100%', md: '160px', lg: '220px', xl: '280px' }}
              h="100%"
              minH="100px"
              align="center"
              justify="center"
              bg="gray.700"
              color="white"
              rounded="lg"
              shadow="lg"
              p="2"
              mb="6"
            >
              <Box>
                <Flex direction="column">
                  <Text fontSize="0.875rem">有無插座</Text>
                  <Heading as="h4" fontSize="1.75rem">
                    {checkSocket(cafe.socket)}
                  </Heading>
                </Flex>
              </Box>
              <Icon as={ImPowerCord} boxSize="32px" color="yellow.400" />
            </Flex>

            <Flex
              w="100%"
              maxW={{ base: '100%', md: '160px', lg: '220px', xl: '280px' }}
              h="100%"
              minH="100px"
              align="center"
              justify="center"
              bg="gray.700"
              color="white"
              rounded="lg"
              shadow="lg"
              p="2"
              mb="6"
            >
              <Box>
                <Flex direction="column">
                  <Text fontSize="0.875rem">站立座位</Text>
                  <Heading as="h4" fontSize="1.75rem">
                    {checkStandSeat(cafe.standing_desk)}
                  </Heading>
                </Flex>
              </Box>
              <Icon as={GiPerson} boxSize="32px" color="yellow.400" />
            </Flex>
          </Flex>

          <Flex direction={{ base: 'column', sm: 'row' }}>
            <SecondaryFeatureStat
              feature1={{ name: 'WiFi穩定', value: cafe.wifi }}
              feature2={{
                name: '價格親民',
                value: cafe.cheap,
              }}
            />
            <SecondaryFeatureStat
              feature1={{ name: '安靜程度', value: cafe.quiet }}
              feature2={{
                name: '裝潢音樂',
                value: cafe.music,
              }}
            />
          </Flex>

          {/* IG Wall section */}
          <Flex w="100%" direction="column">
            <Heading as="h4" size="1.5rem">
              Instagram Wall
            </Heading>
            <Flex wrap="wrap" justify="space-between">
              <IGCard />
              <IGCard />
              <IGCard />
              <IGCard />
            </Flex>
          </Flex>

          {/* Comments section */}
          <Flex w="100%" direction="column" my="6">
            <Flex w="100%" justify="space-between" align="center">
              <Heading as="h4" size="1.5rem">
                Comments
              </Heading>
              <Button>Add Comment</Button>
            </Flex>
            <Comment />
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default Cafe
