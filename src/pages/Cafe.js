import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// prettier-ignore
import {
  Flex,Heading,Box,Image,Text,Spinner,Icon,IconButton, Button,Link,Divider,useDisclosure,Modal,ModalOverlay,ModalContent,Textarea,ModalFooter,ModalBody,ModalCloseButton,Input,InputLeftElement,InputGroup,
} from '@chakra-ui/react'
import { GiRoundStar } from 'react-icons/gi'
import {
  BsBookmark,
  BsFillBookmarkFill,
  BsFillExclamationTriangleFill,
} from 'react-icons/bs'
import { BiAlarmExclamation, BiCommentDots } from 'react-icons/bi'
import { ImPowerCord } from 'react-icons/im'
import { GiPerson } from 'react-icons/gi'
import {
  RiDirectionFill,
  RiGlobalFill,
  RiReplyAllFill,
  RiAddFill,
} from 'react-icons/ri'
import RatingStat from '../components/cafe/RatingStat'
import IGCard from '../components/cafe/IGCard'
import Comment from '../components/cafe/Comment'
import { firebase } from '../utils/firebase'

function Cafe({ userId }) {
  console.log('Inside Cafe Page, user ID: ', userId)

  const [cafe, setCafe] = useState({})
  const [toggleSaved, setToggleSaved] = useState(false)
  // const [igHashtag, setIgHashtag] = useState('')
  // const [user, setUser] = useState({})
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { cafeId } = useParams()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
      .then(data => {
        // console.log('From Cafe Page: ', data)
        const cafe = data.filter(item => item.id === cafeId)[0]
        setCafe(cafe)

        firebase.getComments(cafe.id).then(data => setComments(data))

        /* BUG
        // 無法取得 api 傳回來的資料
        const searchHashtag = cafe.name.split(' ').join('')
        fetch(`https://ka-pi-server.herokuapp.com/igPosts/${searchHashtag}`)
          .then(res => {
            if (!res.ok) throw new Error('無法取得 IG 資料')
            res.json()
          })
          .then(data => console.log(data))
          .catch(error => {
            alert(error)
          })
        */
      })
      .catch(error => {
        alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Check this cafe is saved by user or not, not to render different icon
  useEffect(() => {
    firebase.getUser(userId).then(data => {
      console.log(data.favCafes.includes(cafe.id))
      setToggleSaved(data.favCafes.includes(cafe.id))
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

  const handleAddComment = () => {
    console.log('Add new comment')
    firebase.addComment(cafe.id, 'test123', newComment)
    setNewComment('')
  }

  const handleToggleSaved = () => {
    if (toggleSaved) {
      firebase
        .deleteSavedCafe(userId, cafe.id)
        .then(() => setToggleSaved(prev => !prev))
    } else {
      firebase.saveCafe(userId, cafe.id).then(() => {
        console.log('Cafe added to : ', userId, cafeId)
        setToggleSaved(prev => !prev)
      })
    }
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
                  <Link
                    href={`https://www.google.com/maps/place/${cafe.latitude},${cafe.longitude}/@${cafe.latitude},${cafe.longitude},16z`}
                    isExternal
                  >
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
            <RatingStat
              feature1={{ name: 'WiFi穩定', value: cafe.wifi }}
              feature2={{
                name: '價格親民',
                value: cafe.cheap,
              }}
            />
            <RatingStat
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
            <Flex w="100%" wrap="wrap" justify="space-between">
              <IGCard />
            </Flex>
          </Flex>

          {/* Comments section */}
          <Flex w="100%" direction="column" my="6">
            <Flex w="100%" justify="space-between" align="center">
              <Heading as="h4" size="1.5rem">
                Comments
              </Heading>
              <Button onClick={onOpen} leftIcon={<RiAddFill />} size="xs">
                Add Comment
              </Button>
              <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="md"
                isCentered={true}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Leave your comment here..."
                      size="md"
                      mt="10"
                      mb="6"
                    />
                    <InputGroup>
                      <InputLeftElement
                        children={<RiAddFill color="gray.300" />}
                      />
                      <Input
                        type="file"
                        border="none"
                        name="image"
                        accept="image/*"
                      />
                    </InputGroup>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      variant="ghost"
                      isDisabled={newComment === '' ? true : false}
                      onClick={handleAddComment}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
            {comments.map(comment => (
              <Comment
                key={comment.commentId}
                userId={comment.userId}
                date={comment.createdAt}
                text={comment.text}
              />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default Cafe
