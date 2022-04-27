import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Box, Text, Spinner, Icon, IconButton, Button, Link, useDisclosure, Modal, ModalOverlay, ModalContent, Textarea, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, InputLeftElement, InputGroup, AspectRatio, Image } from '@chakra-ui/react'
import { GiRoundStar } from 'react-icons/gi'
// prettier-ignore
import { BsBookmark, BsFillBookmarkFill, BsFillExclamationTriangleFill } from 'react-icons/bs'
import { BiAlarmExclamation, BiCommentDots } from 'react-icons/bi'
import { ImPowerCord } from 'react-icons/im'
import { GiPerson } from 'react-icons/gi'
// prettier-ignore
import { RiDirectionFill, RiGlobalFill, RiReplyAllFill, RiAddFill } from 'react-icons/ri'
import RatingStat from '../components/cafe/RatingStat'
import GooglePlaceCard from '../components/cafe/GooglePlaceCard'
import BlogCard from '../components/cafe/BlogCard'
import Comment from '../components/cafe/Comment'
import { firebase } from '../utils/firebase'
import useUpdateEffect from '../hooks/useUpdateEffect'
import usePageTracking from '../usePageTracking'
import { useAuth } from '../contexts/AuthContext'

function Cafe() {
  usePageTracking()

  const [cafe, setCafe] = useState({})
  const [toggleSaved, setToggleSaved] = useState(false)
  const [savedNumber, setSavedNumber] = useState([])
  const [blogs, setBlogs] = useState([])
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commentPhotoUrl, setCommentPhotoUrl] = useState('')
  const [googlePhotoRefs, setGooglePhotoRefs] = useState([])
  const [pageViews, setPageViews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const { currentUser } = useAuth()
  const commentPhotoRef = useRef()
  const { cafeId } = useParams()
  const navigate = useNavigate()

  const {
    isOpen: isCommentOpen,
    onOpen: onCommentOpen,
    onClose: onCommentClose,
  } = useDisclosure()
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  useEffect(() => {
    fetch('https://ka-pi-server.herokuapp.com/allcafes')
      .then(res => res.json())
      .then(data => {
        const cafe = data.filter(item => item.id === cafeId)[0]
        setCafe(cafe)

        firebase.getAllBlogs(cafe.id).then(data => setBlogs(data))
        firebase
          .getComments(cafe.id)
          .then(commentList => setComments(commentList))

        console.log('Cafe Name: ', cafe.name)

        // Create a cafe doc
        // firebase.addCafeDoc(cafe.id, { mainPhoto: ''))

        firebase.updatePageViews(cafe.id)
        firebase.getPageViews(cafe.id).then(views => setPageViews(views))

        // Check how many users save this cafe
        firebase.checkSavedNumber(cafe.id).then(doc => setSavedNumber(doc))

        if (currentUser) {
          // Check this cafe is saved by user or not and render init icon
          firebase
            .getUser(currentUser.uid)
            .then(data => setToggleSaved(data.favCafes.includes(cafe.id)))
        }

        // TODO
        // 為了不要一直打 google maps api 先關掉，之後demo時打開
        fetch(`https://ka-pi-server.herokuapp.com/photorefs/${cafe.name}`)
          .then(res => res.json())
          .then(data => {
            const references = data
              .slice(0, 6)
              .map(photo => photo.photo_reference)
            setGooglePhotoRefs(references)

            console.log('From google api: ', references)
          })
          .finally(() => setIsLoading(false))
      })
      .catch(error => {
        alert('無法取得咖啡廳資料庫，請確認網路連線，或聯繫開發人員')
        console.error(error)
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

  const handleClickAddComment = () => {
    if (!currentUser) {
      alert('留言前須先登入，請前往登入或註冊帳號')
      return
    }
    onCommentOpen()
  }

  const handleCommentPhotoUpload = e => {
    if (e.target.files[0]) {
      firebase
        .getCommentPhotoUrl(e.target.files[0])
        .then(url => setCommentPhotoUrl(url))
        .catch(error => {
          alert('圖片上傳失敗，請重新操作一次；如連續失敗請通知網站開發人員')
          console.error(error)
        })
    }
  }

  const handleAddComment = () => {
    firebase
      .addComment(cafe.id, currentUser.uid, commentText, commentPhotoUrl)
      .then(() => {
        setCommentText('')
        onCommentClose()

        firebase
          .listenCommentsChanges(cafe.id)
          .then(commentList => setComments(commentList))
      })
  }

  const handleToggleSaved = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }

    if (toggleSaved) {
      firebase
        .deleteSavedCafe(currentUser.uid, cafe.id)
        .then(() => setToggleSaved(prev => !prev))
    } else {
      firebase.saveCafe(currentUser.uid, cafe.id).then(() => {
        setToggleSaved(prev => !prev)
      })
    }
  }

  const handleWriteBlogClick = () => {
    firebase.addBlog(cafe.id, currentUser.uid).then(blogId => {
      navigate(`blog/edit/${blogId}`)
    })
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
            bgImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${googlePhotoRefs[0]}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY})`}
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

          {/* Calculate saved numbers & page views section */}
          <Flex my="3" direction="column">
            <Text>
              共有 {savedNumber.length > 0 ? savedNumber.length : 0} 人收藏
            </Text>
            <Text>共被瀏覽 {pageViews} 次</Text>
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

          {/* Google Reviews Photos section */}
          <Flex w="100%" direction="column">
            <Heading as="h4" size="1.5rem">
              More Photos
            </Heading>
            <Flex w="100%" wrap="wrap" justify="space-between">
              {googlePhotoRefs.length > 0 &&
                googlePhotoRefs.map(ref => (
                  <GooglePlaceCard key={ref} photoRef={ref} />
                ))}
            </Flex>
          </Flex>

          {/* Blogs section */}
          <Flex w="100%" direction="column" my="6">
            <Flex w="100%" justify="space-between" align="center" mb="4">
              <Heading as="h4" size="1.5rem">
                Blogs
              </Heading>
              <Button
                leftIcon={<RiAddFill />}
                size="xs"
                onClick={handleWriteBlogClick}
              >
                Write a blog
              </Button>
            </Flex>
            <Flex>
              {blogs.map(blog => (
                <BlogCard
                  key={blog.blogId}
                  cafeId={blog.cafeId}
                  blogId={blog.blogId}
                  content={blog.content}
                  title={blog.title}
                  date={blog.createdAt}
                  image={blog.image}
                />
              ))}
            </Flex>
          </Flex>

          {/* Comments section */}
          <Flex w="100%" direction="column" my="6">
            <Flex w="100%" justify="space-between" align="center">
              <Heading as="h4" size="1.5rem">
                Comments
              </Heading>
              <Button
                onClick={handleClickAddComment}
                leftIcon={<RiAddFill />}
                size="xs"
              >
                Add Comment
              </Button>
              <Modal
                isOpen={isCommentOpen}
                onClose={onCommentClose}
                size="md"
                isCentered={true}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Leave your comment here..."
                      size="md"
                      mt="10"
                      mb="6"
                    />
                    <Flex mb="6">
                      <AspectRatio w="100%" maxWidth="100px" ratio={1}>
                        <Image
                          src={commentPhotoUrl ? commentPhotoUrl : ''}
                          alt="留言照片"
                          fit="cover"
                          fallbackSrc="https://via.placeholder.com/100?text=photo"
                        />
                      </AspectRatio>
                      <Button
                        colorScheme="blackAlpha"
                        aria-label="上傳留言照"
                        leftIcon={<RiAddFill />}
                        size="xs"
                        ml="2"
                        mt="auto"
                        onClick={() => commentPhotoRef.current.click()}
                      >
                        Upload
                      </Button>
                      <Input
                        ref={commentPhotoRef}
                        type="file"
                        name="coverPhoto"
                        accept="image/*"
                        onChange={e => handleCommentPhotoUpload(e)}
                        hidden
                      />
                    </Flex>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      variant="ghost"
                      isDisabled={commentText === '' ? true : false}
                      onClick={handleAddComment}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
            {comments.length > 0 &&
              comments.map(comment => (
                <Comment
                  key={comment.commentId}
                  cafeId={cafe.id}
                  commentId={comment.commentId}
                  commentUserId={comment.userId}
                  date={comment.createdAt}
                  text={comment.text}
                  image={comment.image}
                  currentUser={currentUser}
                />
              ))}
          </Flex>

          <Modal
            onClose={onAlertClose}
            size="md"
            isOpen={isAlertOpen}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Oops! 尚未登入</ModalHeader>
              <ModalCloseButton />
              <ModalBody>請先登入或註冊，即可開始蒐藏咖啡廳：）</ModalBody>
              <ModalFooter>
                <Button onClick={() => navigate('/auth')}>前往登入</Button>
                <Button onClick={onAlertClose} ml="3">
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Flex>
  )
}

export default Cafe
