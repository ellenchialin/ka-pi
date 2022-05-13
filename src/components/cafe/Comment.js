import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Image, Text, Divider, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Textarea, Input, ModalFooter, Button, useDisclosure, AspectRatio, useColorModeValue, Box, HStack, useToast, Icon, Avatar, VStack } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { RiAddFill } from 'react-icons/ri'
import { BiSmile } from 'react-icons/bi'
import { firebase } from '../../utils/firebase'
import Picker from 'emoji-picker-react'
import AlertModal from '../AlertModal'
import Reply from './Reply'

function Comment({
  currentUser,
  cafeId,
  commentId,
  commentUserId,
  text,
  date,
  image,
}) {
  const [currentUserInfo, setCurrentUserInfo] = useState({})
  const [commentUserInfo, setCommentUserInfo] = useState({})
  const [replyText, setReplyText] = useState('')
  const [replyPhotoUrl, setReplyPhotoUrl] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [replyList, setReplyList] = useState([])
  const convertedCommentDate = date.toDate().toLocaleDateString()

  const replyPhotoRef = useRef()
  const navigate = useNavigate()
  const successToast = useToast()

  const {
    isOpen: isCommentPhotoOpen,
    onOpen: onCommentPhotoOpen,
    onClose: onCommentPhotoClose,
  } = useDisclosure()

  const {
    isOpen: isReplyOpen,
    onOpen: onReplyOpen,
    onClose: onReplyClose,
  } = useDisclosure()

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const {
    isOpen: isUploadAlertOpen,
    onOpen: onUploadAlertOpen,
    onClose: onUploadAlertClose,
  } = useDisclosure()

  useEffect(() => {
    firebase.getUser(commentUserId).then(data => {
      setCommentUserInfo(data)
    })

    firebase.getUser(currentUser.uid).then(data => setCurrentUserInfo(data))
  }, [])

  useEffect(() => {
    firebase.getReplyList(cafeId, commentId).then(list => {
      setReplyList(list)
    })
  }, [])

  const handleReplyPhotoUpload = e => {
    if (e.target.files[0]) {
      firebase
        .getReplyPhotoUrl(e.target.files[0])
        .then(url => setReplyPhotoUrl(url))
        .catch(error => {
          onUploadAlertOpen()
          console.error(error)
        })
    }
  }

  const handleClickReply = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }
    setReplyPhotoUrl('')
    onReplyOpen()
  }

  const submitReply = () => {
    const repliedDetails = {
      cafeId,
      commentId,
      userId: currentUser.uid,
      image: replyPhotoUrl,
      text: replyText,
    }

    firebase.addReply(repliedDetails).then(() => {
      setReplyText('')
      onReplyClose()

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
            <Text>成功回覆留言</Text>
          </HStack>
        ),
        isClosable: true,
      })

      firebase.getReplyList(cafeId, commentId).then(list => {
        setReplyList(list)
      })
    })
  }

  const onEmojiClick = (event, emojiObject) => {
    setReplyText(prevReplyText => prevReplyText + emojiObject.emoji)
  }

  const handleAlertAction = () => navigate('/auth')

  return (
    <Flex w="100%" direction="column" my="2">
      <Flex w="100%" justify="space-between" align="flex-start" mb="1">
        <Avatar
          size="md"
          name={commentUserInfo.name}
          src={commentUserInfo.photo}
        />
        <Flex w="full" direction="column" ml="4">
          <Box
            w="full"
            maxW="500px"
            bg={useColorModeValue('gray.100', 'secondaryLight')}
            borderRadius="xl"
            p="4"
            mb="2"
          >
            <Text color="primaryDark" fontWeight="bold">
              {commentUserInfo.name}
            </Text>
            <Text color="primaryDark">{text}</Text>
            {image && (
              <>
                <AspectRatio w="100%" maxWidth="100px" mt="2" ratio={1}>
                  <Image
                    src={image}
                    alt="留言照片"
                    fit="cover"
                    onClick={onCommentPhotoOpen}
                    cursor="pointer"
                  />
                </AspectRatio>

                <Modal
                  size="full"
                  isOpen={isCommentPhotoOpen}
                  onClose={onCommentPhotoClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalCloseButton />
                    <ModalBody p="10">
                      <AspectRatio h="85vh" _before={{ pb: '0' }}>
                        <Image src={image} alt="留言照片" align="center" />
                      </AspectRatio>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </>
            )}
          </Box>
          <HStack spacing="10px">
            <Text fontSize="0.75rem" alignSelf="flex-end">
              {convertedCommentDate}
            </Text>

            <Text
              fontSize="0.75rem"
              _hover={{ color: 'teal' }}
              cursor="pointer"
              onClick={handleClickReply}
            >
              Reply
            </Text>
            <AlertModal
              isAlertOpen={isAlertOpen}
              onAlertClose={onAlertClose}
              alertHeader="Oops! 尚未登入"
              alertBody="請先登入或註冊：）"
              actionText="前往登入"
              alertAction={() => handleAlertAction()}
            />
            <Modal
              isOpen={isReplyOpen}
              onClose={onReplyClose}
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
                        name={currentUserInfo.name}
                        src={currentUserInfo.photo}
                      />
                      <Text color="primaryDark">{currentUserInfo.name}</Text>
                    </HStack>
                    <Textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onFocus={() => setShowEmoji(false)}
                      placeholder="Leave your reply here..."
                      size="md"
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
                        src={replyPhotoUrl ? replyPhotoUrl : ''}
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
                      onClick={() => replyPhotoRef.current.click()}
                    >
                      上傳
                    </Button>
                    <Input
                      ref={replyPhotoRef}
                      type="file"
                      name="coverPhoto"
                      accept="image/*"
                      onChange={e => handleReplyPhotoUpload(e)}
                      hidden
                    />
                  </Flex>
                </ModalBody>

                <ModalFooter>
                  <Button
                    variant="auth-buttons"
                    isDisabled={replyText === '' ? true : false}
                    onClick={submitReply}
                    _hover={{
                      bg: 'primaryDark',
                      _disabled: { bg: 'secondaryLight' },
                    }}
                  >
                    回覆
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
          </HStack>
        </Flex>
      </Flex>
      {/* Replies */}
      {replyList.length > 0 &&
        replyList.map(reply => (
          <Reply
            key={reply.text}
            replyUserId={reply.userId}
            replyText={reply.text}
            replyImage={reply.image}
            replyDate={reply.repliedAt}
          />
        ))}
      <Divider mt="2" />
    </Flex>
  )
}

Comment.propTypes = {
  currentUser: PropTypes.object,
  cafeId: PropTypes.string,
  commentId: PropTypes.string,
  commentUserId: PropTypes.string,
  text: PropTypes.string,
  date: PropTypes.object,
  image: PropTypes.string,
}

export default Comment
