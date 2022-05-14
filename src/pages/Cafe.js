import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Heading, Box, Text, Spinner, Icon, IconButton, Button, Link, useDisclosure, Modal, ModalOverlay, ModalContent, Textarea, ModalFooter, ModalBody, ModalCloseButton, Input, AspectRatio, Image, HStack, VStack, Stack, SimpleGrid, useColorModeValue, useToast, Avatar } from '@chakra-ui/react'
import { StarIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { VscPerson } from 'react-icons/vsc'
import { AiOutlineGlobal } from 'react-icons/ai'
import { BsBookmark, BsFillBookmarkFill, BsEyeFill } from 'react-icons/bs'
import { BiAlarmExclamation, BiPlug, BiSmile } from 'react-icons/bi'
import { RiDirectionFill, RiAddFill } from 'react-icons/ri'
import Picker from 'emoji-picker-react'
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
  const [userInfo, setUserInfo] = useState({})
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commentPhotoUrl, setCommentPhotoUrl] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
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
  const {
    isOpen: isGetCafesAlertOpen,
    onOpen: onGetCafesAlertOpen,
    onClose: onGetCafesAlertClose,
  } = useDisclosure()
  const {
    isOpen: isUploadAlertOpen,
    onOpen: onUploadAlertOpen,
    onClose: onUploadAlertClose,
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
          firebase.getUser(currentUser.uid).then(data => {
            setUserInfo(data)
            setToggleSaved(data.favCafes.includes(cafe.id))
          })
        }

        fetch(`https://ka-pi-server.herokuapp.com/photorefs/${cafe.name}`)
          .then(res => res.json())
          .then(data => {
            if (data.length === 0) {
              setGooglePhotoRefs([])
            }

            const references = data
              .slice(0, 6)
              .map(photo => photo.photo_reference)
            setGooglePhotoRefs(references)
          })
          .catch(error => {
            console.error(error)
          })
          .finally(() => setIsLoading(false))
      })
      .catch(error => {
        onGetCafesAlertOpen()
        console.error(error)
      })
  }, [])

  const checkLimitedTime = limited => {
    if (limited === 'no') {
      return '不限時'
    } else if (limited === 'maybe') {
      return '視平假日'
    } else if (limited === 'yes') {
      return '有限時'
    } else {
      return '未提供資訊'
    }
  }

  const checkSocket = socket => {
    if (socket === 'yes') {
      return '很多'
    } else if (socket === 'maybe') {
      return '部分'
    } else if (socket === 'no') {
      return '很少'
    } else {
      return '未提供資訊'
    }
  }

  const checkStandSeat = standing => {
    if (standing === 'no') {
      return '沒有'
    } else if (standing === 'yes') {
      return '部分'
    } else {
      return '未提供資訊'
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
          onUploadAlertOpen()
          console.error(error)
        })
    }
  }

  const submitComment = () => {
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
      firebase.deleteSavedCafe(currentUser.uid, cafe.id).then(() => {
        setToggleSaved(prev => !prev)
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
              <Text>已移除收藏</Text>
            </HStack>
          ),
          isClosable: true,
        })
      })
    } else {
      firebase.saveCafe(currentUser.uid, cafe.id).then(() => {
        setToggleSaved(prev => !prev)
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
              <Text>已成功收藏</Text>
            </HStack>
          ),
          isClosable: true,
        })
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

  const cafeCoverUrl = () => {
    if (googlePhotoRefs.length === 0) {
      if (blogs.length > 0) {
        return blogs[0].image
      }
      return
    }
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${googlePhotoRefs[0]}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
  }

  const onEmojiClick = (event, emojiObject) => {
    setCommentText(prevCommentText => prevCommentText + emojiObject.emoji)
  }

  const subtagTextColor = useColorModeValue('thirdDark', 'secondaryLight')

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      w="100%"
      h="100%"
      minH="100vh"
      maxW="1170px"
    >
      {isLoading ? (
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal"
          size="lg"
          mt="6"
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

          {/* Calculate saved numbers & page views section */}
          <Box alignSelf="flex-end">
            <HStack>
              <HStack align="center">
                <Text>{savedNumber.length > 0 ? savedNumber.length : 0}</Text>
                <Icon as={BsFillBookmarkFill} />
              </HStack>
              <HStack align="center">
                <Text>{pageViews}</Text>
                <Icon as={BsEyeFill} />
              </HStack>
            </HStack>
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
            mb="16"
          >
            {primaryFeatures.map(feature => (
              <HStack
                key={feature.name}
                w="100%"
                maxW={{ base: '100%', md: '200px', lg: '250px', xl: '280px' }}
                h="-webkit-fit-content"
                spacing={{ base: '40px', md: '20px', lg: '40px' }}
                justify="center"
                bg="primaryDark"
                color="primaryLight"
                rounded="lg"
                shadow="md"
                px="2"
                py="3"
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
          <Flex w="100%" direction="column" mb="16">
            <Text color={subtagTextColor}>快速導覽</Text>
            <Text
              fontSize={{ base: '20px', md: '24px' }}
              fontWeight="bold"
              mb="6"
            >
              Google 評論照片
            </Text>
            <SimpleGrid
              w="full"
              spacing={{ base: '10px', sm: '20px' }}
              minChildWidth="220px"
              justifyItems="center"
            >
              {googlePhotoRefs.length > 0 ? (
                googlePhotoRefs.map(ref => (
                  <GooglePlaceCard key={ref} photoRef={ref} />
                ))
              ) : (
                <Text color={subtagTextColor}>Google 評論暫無提供資料</Text>
              )}
            </SimpleGrid>
          </Flex>

          {/* Blogs section */}
          <Flex w="full" direction="column" mb="16">
            <Flex w="full" justify="space-between" align="end" mb="6">
              <VStack align="flex-start" spacing="0">
                <Text color={subtagTextColor}>店內細節</Text>
                <Text
                  fontSize={{ base: '20px', md: '24px' }}
                  fontWeight="bold"
                  mt="0"
                >
                  全站用戶食記
                </Text>
              </VStack>
              <Button
                leftIcon={<RiAddFill />}
                size="sm"
                h="9"
                fontSize="16px"
                onClick={handleClickAddBlog}
              >
                撰寫食記
              </Button>
            </Flex>

            <Flex
              w="full"
              justify={{ base: 'center', md: 'stretch' }}
              wrap="wrap"
              gap="8"
            >
              {blogs.length > 0 ? (
                blogs.map(blog => (
                  <BlogCard
                    key={blog.blogId}
                    cafeId={blog.cafeId}
                    blogId={blog.blogId}
                    content={blog.content}
                    title={blog.title}
                    date={blog.createdAt}
                    image={blog.image}
                  />
                ))
              ) : (
                <Text color={subtagTextColor}>尚未有任何食記</Text>
              )}
            </Flex>
          </Flex>

          {/* Comments section */}
          <Flex w="100%" direction="column">
            <Flex w="100%" justify="space-between" align="end" mb="6">
              <VStack align="flex-start" spacing="0">
                <Text color={subtagTextColor}>有話想說？</Text>
                <Text
                  fontSize={{ base: '20px', md: '24px' }}
                  fontWeight="bold"
                  mt="0"
                >
                  留下任何想法
                </Text>
              </VStack>
              <Button
                leftIcon={<RiAddFill />}
                size="sm"
                h="9"
                fontSize="16px"
                onClick={handleClickAddComment}
              >
                發表留言
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
                <ModalContent mx="2">
                  <ModalCloseButton color="primaryDark" />
                  <ModalBody>
                    <VStack
                      position="relative"
                      mt="10"
                      mb="6"
                      borderWidth="1px"
                      borderColor="secondaryLight"
                      borderRadius="md"
                    >
                      <HStack w="100%" px="4" pt="2" alignSelf="flex-start">
                        <Avatar
                          size="sm"
                          name={userInfo.name}
                          src={userInfo.photo}
                        />
                        <Text color="primaryDark">{userInfo.name}</Text>
                      </HStack>
                      <Textarea
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onFocus={() => setShowEmoji(false)}
                        placeholder="Leave your comment here..."
                        size="md"
                        h="100px"
                        border="none"
                        color="primaryDark"
                        resize="none"
                        focusBorderColor="transparent"
                        _hover={{ borderColor: 'secondaryDark' }}
                      />
                      <Box position="absolute" bottom="0" right="4" zIndex="2">
                        <Icon
                          as={BiSmile}
                          fontSize="24px"
                          color="secondaryLight"
                          cursor="pointer"
                          onClick={() => setShowEmoji(prev => !prev)}
                        />
                      </Box>
                      {showEmoji && (
                        <Picker
                          onEmojiClick={onEmojiClick}
                          disableSearchBar
                          pickerStyle={{
                            height: '200px',
                            position: 'absolute',
                            bottom: '-200px',
                            right: '0',
                            zIndex: '2',
                          }}
                        />
                      )}
                    </VStack>
                    <Flex mb="6" position="relative">
                      <AspectRatio w="100%" maxWidth="150px" ratio={1}>
                        <Image
                          src={commentPhotoUrl ? commentPhotoUrl : ''}
                          alt="留言照片"
                          fit="cover"
                          borderRadius="md"
                          fallbackSrc="https://via.placeholder.com/100?text=photo"
                        />
                      </AspectRatio>
                      <Button
                        variant="auth-buttons"
                        aria-label="上傳留言照"
                        leftIcon={<RiAddFill />}
                        size="xs"
                        position="absolute"
                        top="10px"
                        left="80px"
                        onClick={() => commentPhotoRef.current.click()}
                      >
                        上傳
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
                      onClick={submitComment}
                      _hover={{
                        bg: 'primaryDark',
                        _disabled: { bg: 'secondaryLight' },
                      }}
                    >
                      留言
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <AlertModal
                isAlertOpen={isUploadAlertOpen}
                onAlertClose={onUploadAlertClose}
                alertHeader="Oops! 圖片上傳失敗"
                alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com"
              />
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
              <Text alignSelf="center" color={subtagTextColor}>
                尚未有任何留言
              </Text>
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

          <AlertModal
            isAlertOpen={isGetCafesAlertOpen}
            onAlertClose={onGetCafesAlertClose}
            alertHeader="Oops! 暫無法取得咖啡廳資料"
            alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com"
          />
        </>
      )}
    </Flex>
  )
}

export default Cafe
