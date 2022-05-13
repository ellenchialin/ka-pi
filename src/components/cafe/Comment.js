import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Image, Text, Divider, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Textarea, Input, ModalFooter, Button, useDisclosure, AspectRatio, useColorModeValue, Box, HStack, useToast, Icon, Avatar } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { RiAddFill } from 'react-icons/ri'
import { firebase } from '../../utils/firebase'
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
  const [userInfo, setUserInfo] = useState({})
  const [newReplyText, setNewReplyText] = useState('')
  const [replyPhotoUrl, setReplyPhotoUrl] = useState('')
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
      setUserInfo(data)
    })
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
      text: newReplyText,
    }

    firebase.addReply(repliedDetails).then(() => {
      setNewReplyText('')
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

  const handleAlertAction = () => navigate('/auth')

  return (
    <Flex w="100%" direction="column" my="2">
      <Flex w="100%" justify="space-between" align="flex-start" mb="1">
        <Avatar size="md" name={userInfo.name} src={userInfo.photo} />
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
              {userInfo.name}
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
              <ModalContent>
                <ModalCloseButton color="primaryDark" />
                <ModalBody>
                  <Textarea
                    value={newReplyText}
                    onChange={e => setNewReplyText(e.target.value)}
                    placeholder="Leave your reply here..."
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
                        src={replyPhotoUrl ? replyPhotoUrl : ''}
                        alt="留言照片"
                        fit="cover"
                        maxW="100px"
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
                    <AlertModal
                      isAlertOpen={isUploadAlertOpen}
                      onAlertClose={onUploadAlertClose}
                      alertHeader="Oops! 圖片上傳失敗"
                      alertBody="請確認網路連線並重新操作，或聯繫開發人員 chialin76@gmail.com"
                    />
                  </Flex>
                </ModalBody>

                <ModalFooter>
                  <Button
                    variant="auth-buttons"
                    isDisabled={newReplyText === '' ? true : false}
                    onClick={submitReply}
                    _hover={{
                      _disabled: { bg: 'secondaryLight' },
                    }}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
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
