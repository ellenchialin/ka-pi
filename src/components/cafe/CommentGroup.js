import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Box, Text, Icon, Button, Modal, ModalOverlay, ModalContent, Textarea, ModalFooter, ModalBody, ModalCloseButton, Input, AspectRatio, Image, HStack, VStack, Avatar, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { RiAddFill } from 'react-icons/ri'
import { BiSmile } from 'react-icons/bi'
import Picker from 'emoji-picker-react'

import { useAuth } from '../../contexts/AuthContext'
import { firebase } from '../../utils/firebase'
import Comment from './Comment'
import AlertModal from '../AlertModal'

function CommentGroup({ cafeId, userInfo }) {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commentPhotoUrl, setCommentPhotoUrl] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const navigate = useNavigate()

  const { currentUser } = useAuth()
  const commentPhotoRef = useRef()

  const successToast = useToast()
  const subtagTextColor = useColorModeValue('thirdDark', 'secondaryLight')

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
    isOpen: isUploadAlertOpen,
    onOpen: onUploadAlertOpen,
    onClose: onUploadAlertClose,
  } = useDisclosure()

  useEffect(() => {
    firebase
      .getComments(cafeId)
      .then(commentList => setComments(commentList))
      .catch(error => console.error(error.message))
  }, [])

  const handleClickAddComment = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }
    setCommentPhotoUrl('')
    onCommentOpen()
  }

  const handleCommentPhotoUpload = file => {
    if (file) {
      firebase
        .getCommentPhotoUrl(file)
        .then(url => setCommentPhotoUrl(url))
        .catch(error => {
          onUploadAlertOpen()
          console.error(error)
        })
    }
  }

  const submitComment = () => {
    const commentDetails = {
      cafeId,
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
        .getComments(cafeId)
        .then(commentList => setComments(commentList))
        .catch(error => console.error(error.message))
    })
  }

  const onEmojiClick = (_, emojiObject) => {
    setCommentText(prevCommentText => prevCommentText + emojiObject.emoji)
  }

  const handleAlertAction = () => navigate('/auth')

  return (
    <Flex w="100%" direction="column">
      <Flex w="100%" justify="space-between" align="end" mb="6">
        <VStack align="flex-start" spacing="0">
          <Text color={subtagTextColor}>有話想說</Text>
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
                  <Avatar size="sm" name={userInfo.name} src={userInfo.photo} />
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
                  onChange={e => handleCommentPhotoUpload(e.target.files[0])}
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
      </Flex>
      {comments.length > 0 ? (
        comments.map(comment => (
          <Comment
            key={comment.commentId}
            cafeId={cafeId}
            currentUser={currentUser}
            comment={comment}
          />
        ))
      ) : (
        <Text alignSelf="center" color={subtagTextColor}>
          尚未有任何留言
        </Text>
      )}
      <AlertModal
        isAlertOpen={isAlertOpen}
        onAlertClose={onAlertClose}
        alertHeader="Oops! 尚未登入"
        alertBody="請先登入或註冊：）"
        actionText="前往登入"
        alertAction={() => handleAlertAction()}
      />
      <AlertModal
        isAlertOpen={isUploadAlertOpen}
        onAlertClose={onUploadAlertClose}
        alertHeader="Oops! 圖片上傳失敗"
        alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com"
      />
    </Flex>
  )
}

CommentGroup.propTypes = {
  cafeId: PropTypes.string.isRequired,
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.string,
  }),
}

export default CommentGroup
