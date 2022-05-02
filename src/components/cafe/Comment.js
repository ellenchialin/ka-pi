import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
// prettier-ignore
import { Flex, Image, Text, Divider, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Textarea, Input, ModalFooter, Button, useDisclosure, AspectRatio, useColorModeValue, Box, HStack } from '@chakra-ui/react'
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

  const replyPhotoRef = useRef()
  const navigate = useNavigate()

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
          alert('圖片上傳失敗，請重新操作一次；如連續失敗請通知網站開發人員')
          console.error(error)
        })
    }
  }

  const handleClickReply = () => {
    if (!currentUser) {
      onAlertOpen()
      return
    }
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
      console.log('Reply Added')
      setNewReplyText('')
      onReplyClose()

      firebase.getReplyList(cafeId, commentId).then(list => {
        console.log('Latest Reply List: ', list)
        setReplyList(list)
      })
    })
  }

  const handleAlertAction = () => navigate('/auth')

  return (
    <Flex w="100%" direction="column" my="2">
      <Flex w="100%" justify="space-between" align="flex-start" mb="1">
        <Image
          borderRadius="full"
          boxSize="35px"
          src={userInfo.photo}
          alt={userInfo.name}
          objectFit="cover"
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
            <Text mb="1" color="primaryDark">
              {text}
            </Text>
            {image && (
              <>
                <AspectRatio w="100%" maxWidth="100px" ratio={1}>
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
                      <Image src={image} alt="留言照片" fit="cover" />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </>
            )}
          </Box>
          <HStack spacing="10px">
            <Text fontSize="0.75rem" alignSelf="flex-end">
              {date}
            </Text>

            <Text
              fontSize="0.75rem"
              _hover={{ color: 'teal' }}
              cusor="pointer"
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
                      Upload
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
                    isDisabled={newReplyText === '' ? true : false}
                    onClick={submitReply}
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

export default Comment
