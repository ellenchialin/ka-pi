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
import AlertModal from '../shared/AlertModal'
import Reply from './Reply'

function Comment({ cafeId, currentUser, comment }) {
  const { commentId, userId: commentUserId, createdAt, text, image } = comment
  const [currentUserInfo, setCurrentUserInfo] = useState({})
  const [commentUserInfo, setCommentUserInfo] = useState({})
  const [replyText, setReplyText] = useState('')
  const [replyPhotoUrl, setReplyPhotoUrl] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [replyList, setReplyList] = useState([])
  const convertedCommentDate = createdAt.toDate().toLocaleDateString()

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
    firebase
      .getUser(commentUserId)
      .then(data => setCommentUserInfo(data))
      .catch(error => console.error(error.message))

    if (currentUser) {
      firebase
        .getUser(currentUser.uid)
        .then(data => setCurrentUserInfo(data))
        .catch(error => console.error(error.message))
    }
  }, [])

  useEffect(() => {
    firebase
      .getReplyList(cafeId, commentId)
      .then(list => setReplyList(list))
      .catch(error => console.error(error.message))
  }, [])

  const handleReplyPhotoUpload = (file, callback) => {
    if (file) {
      firebase
        .getReplyPhotoUrl(file)
        .then(url => callback(url))
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

    firebase
      .addReply(repliedDetails)
      .then(() => {
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
              <Text>??????????????????</Text>
            </HStack>
          ),
          isClosable: true,
        })

        firebase
          .getReplyList(cafeId, commentId)
          .then(list => setReplyList(list))
          .catch(error => console.error(error.message))
      })
      .catch(error => console.error(error.message))
  }

  const onEmojiClick = (_, emojiObject) => {
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
                    alt="????????????"
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
                        <Image src={image} alt="????????????" align="center" />
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
                        alt="????????????"
                        fit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/100?text=photo"
                      />
                    </AspectRatio>
                    <Button
                      variant="auth-buttons"
                      aria-label="???????????????"
                      leftIcon={<RiAddFill />}
                      size="xs"
                      position="absolute"
                      top="10px"
                      left="80px"
                      onClick={() => replyPhotoRef.current.click()}
                    >
                      ??????
                    </Button>
                    <Input
                      ref={replyPhotoRef}
                      type="file"
                      name="coverPhoto"
                      accept="image/*"
                      onChange={e =>
                        handleReplyPhotoUpload(
                          e.target.files[0],
                          setReplyPhotoUrl
                        )
                      }
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
                    ??????
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <AlertModal
              isAlertOpen={isAlertOpen}
              onAlertClose={onAlertClose}
              alertHeader="Oops! ????????????"
              alertBody="???????????????????????????"
              actionText="????????????"
              alertAction={() => handleAlertAction()}
            />
            <AlertModal
              isAlertOpen={isUploadAlertOpen}
              onAlertClose={onUploadAlertClose}
              alertHeader="Oops! ??????????????????"
              alertBody="???????????????????????????????????????????????????????????? chialin76@gmail.com"
            />
          </HStack>
        </Flex>
      </Flex>
      {replyList.length > 0 &&
        replyList.map(reply => <Reply key={reply.text} reply={reply} />)}
      <Divider mt="2" />
    </Flex>
  )
}

Comment.propTypes = {
  currentUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }),
  cafeId: PropTypes.string.isRequired,
  comment: PropTypes.shape({
    commentId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }),
}

export default Comment
