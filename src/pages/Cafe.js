import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Box, Text, Spinner, Icon, IconButton, Button, Link, useDisclosure, Modal, ModalOverlay, ModalContent, Textarea, ModalFooter, ModalBody, ModalCloseButton, Input, AspectRatio, Image, HStack, VStack, Stack, SimpleGrid, useColorModeValue, useToast } from '@chakra-ui/react'
import { StarIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { VscPerson } from 'react-icons/vsc'
import { AiOutlineGlobal } from 'react-icons/ai'
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs'
import { BiAlarmExclamation, BiPlug } from 'react-icons/bi'
import { RiDirectionFill, RiAddFill } from 'react-icons/ri'
import RatingStat from '../components/cafe/RatingStat'
import GooglePlaceCard from '../components/cafe/GooglePlaceCard'
import BlogCard from '../components/cafe/BlogCard'
import Comment from '../components/cafe/Comment'
import AlertModal from '../components/AlertModal'
import { api } from '../utils/api'
import { firebase } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'
import usePageTracking from '../usePageTracking'

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
  const successToast = useToast()

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
    api
      .getAllCafes()
      .then(data => {
        const cafe = data.find(item => item.id === cafeId)
        setCafe(cafe)

        firebase.getAllBlogs(cafe.id).then(data => setBlogs(data))
        firebase
          .getComments(cafe.id)
          .then(commentList => setComments(commentList))

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

  const primaryFeatures = [
    {
      name: '有無限時',
      icon: BiAlarmExclamation,
      func: checkLimitedTime(cafe.limited_time),
    },
    {
      name: '有無插座',
      icon: BiPlug,
      func: checkSocket(cafe.socket),
    },
    {
      name: '站立座位',
      icon: VscPerson,
      func: checkStandSeat(cafe.standing_desk),
    },
  ]

  const handleClickAddComment = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }
    setCommentPhotoUrl('')
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
    const commentDetails = {
      cafeId: cafe.id,
      userId: currentUser.uid,
      text: commentText,
      image: commentPhotoUrl,
    }

    firebase.addComment(commentDetails).then(() => {
      setCommentText('')
      onCommentClose()

      successToast({
        position: 'top-right',
        duration: 3000,
        render: () => (
          <HStack
            spacing="4"
            color="primaryDark"
            p={3}
            bg="teal.200"
            borderRadius="md"
          >
            <Icon as={CheckCircleIcon} />
            <Text>成功送出留言</Text>
          </HStack>
        ),
        isClosable: true,
      })

      firebase
        .getComments(cafe.id)
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

  const handleClickAddBlog = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }
    navigate('blog/edit')
  }

  const handleAlertAction = () => navigate('/auth')

  const subtagTextColor = useColorModeValue('thirdDark', 'secondaryLight')

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      position="relative"
      w="100%"
      maxW="1170px"
      minH="100vh"
    >
      {isLoading ? (
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal"
          size="lg"
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
            minH="300px"
            bgImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${googlePhotoRefs[0]}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY})`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            borderRadius="xl"
            direction="column"
            align="center"
            justify="center"
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

          {/* Calculate saved numbers & page views section */}
          <Box alignSelf="flex-end">
            <Text>
              共 {savedNumber.length > 0 ? savedNumber.length : 0} 人收藏 /{' '}
              {pageViews} 次瀏覽
            </Text>
          </Box>

          {/* Features section */}
          <Stack
            spacing={{ base: '20px', md: '50px', lg: '70px' }}
            direction={['column', 'row']}
            mt="2"
            mb="4"
          >
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
          </Stack>

          <SimpleGrid
            w="full"
            columns={[1, 1, 3]}
            spacing="20px"
            justifyItems="center"
            mb="10"
          >
            {primaryFeatures.map(feature => (
              <HStack
                key={feature.name}
                w="100%"
                maxW={{ base: '100%', md: '200px', lg: '250px', xl: '280px' }}
                h="100%"
                minH="100px"
                spacing={{ base: '40px', md: '20px', lg: '40px' }}
                justify="center"
                bg="primaryDark"
                color="primaryLight"
                rounded="lg"
                shadow="md"
                px="2"
              >
                <VStack spacing="2" align="flex-start">
                  <Text>{feature.name}</Text>
                  <Heading as="h4" fontSize="1.5rem">
                    {feature.func}
                  </Heading>
                </VStack>
                <Icon
                  as={feature.icon}
                  boxSize={feature.icon === VscPerson ? '40px' : '34px'}
                  color="accent"
                />
              </HStack>
            ))}
          </SimpleGrid>

          {/* Google Reviews Photos section */}
          <Flex w="100%" direction="column" mb="10">
            <Text color={subtagTextColor}>Google Reviews</Text>
            <Text
              fontSize={{ base: '20px', md: '28px' }}
              fontWeight="bold"
              mb="4"
            >
              More Photos
            </Text>
            <SimpleGrid
              w="full"
              spacing={{ base: '10px', sm: '20px' }}
              minChildWidth="220px"
              justifyItems="center"
            >
              {googlePhotoRefs.length > 0 &&
                googlePhotoRefs.map(ref => (
                  <GooglePlaceCard key={ref} photoRef={ref} />
                ))}
            </SimpleGrid>
          </Flex>

          {/* Blogs section */}
          <Flex w="full" direction="column" mb="10">
            <Flex w="full" justify="space-between" align="end" mb="4">
              <VStack align="flex-start" spacing="0">
                <Text color={subtagTextColor}>Blogs</Text>
                <Text
                  fontSize={{ base: '20px', md: '28px' }}
                  fontWeight="bold"
                  mt="0"
                >
                  Explore Others' Experience
                </Text>
              </VStack>
              <Button
                leftIcon={<RiAddFill />}
                size="sm"
                fontSize="16px"
                onClick={handleClickAddBlog}
              >
                blog
              </Button>
            </Flex>

            {blogs.length > 0 ? (
              <SimpleGrid
                w="full"
                spacing="20px"
                minChildWidth="270px"
                justifyItems="center"
              >
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
              </SimpleGrid>
            ) : (
              <Text color={subtagTextColor}>尚未有任何食記</Text>
            )}
          </Flex>

          {/* Comments section */}
          <Flex w="100%" direction="column">
            <Flex w="100%" justify="space-between" align="end" mb="4">
              <VStack align="flex-start" spacing="0">
                <Text color={subtagTextColor}>Comments</Text>
                <Text
                  fontSize={{ base: '20px', md: '28px' }}
                  fontWeight="bold"
                  mt="0"
                >
                  Interact With Others
                </Text>
              </VStack>
              <Button
                leftIcon={<RiAddFill />}
                size="sm"
                fontSize="16px"
                onClick={handleClickAddComment}
              >
                comment
              </Button>
              <Modal
                isOpen={isCommentOpen}
                onClose={onCommentClose}
                size="md"
                isCentered
                autoFocus
                variant="comment"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton color="primaryDark" />
                  <ModalBody>
                    <Textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Leave your comment here..."
                      size="md"
                      mt="10"
                      mb="6"
                      borderColor="secondaryLight"
                      color="primaryDark"
                      _hover={{ borderColor: 'secondaryDark' }}
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
                        variant="auth-buttons"
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
                      variant="auth-buttons"
                      isDisabled={commentText === '' ? true : false}
                      onClick={handleAddComment}
                      _hover={{
                        bg: 'primaryDark',
                        _disabled: { bg: 'secondaryLight' },
                      }}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
            {comments.length > 0 ? (
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
              ))
            ) : (
              <Text color={subtagTextColor}>尚未有任何留言</Text>
            )}
          </Flex>

          <AlertModal
            isAlertOpen={isAlertOpen}
            onAlertClose={onAlertClose}
            alertHeader="Oops! 尚未登入"
            alertBody="請先登入或註冊：）"
            actionText="前往登入"
            alertAction={() => handleAlertAction()}
          />
        </>
      )}
    </Flex>
  )
}

export default Cafe
